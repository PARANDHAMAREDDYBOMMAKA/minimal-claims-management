import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Claim, ClaimDocument } from './claim.schema';
import { Model } from 'mongoose';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';

@Injectable()
export class ClaimsService {
    constructor(@InjectModel(Claim.name) private claimModel: Model<ClaimDocument>) { }

    async create(createClaimDto: CreateClaimDto, documentPath?: string): Promise<Claim> {
        const newClaim = new this.claimModel({
            ...createClaimDto,
            document: documentPath || null,
            status: 'Pending',
        });
        return newClaim.save();
    }

    async findAllPaginated(
        user: any,
        filters?: {
            status?: string,
            dateFrom?: Date,
            dateTo?: Date,
            amountMin?: number,
            amountMax?: number
        },
        page: number = 1,
        limit: number = 10
    ): Promise<{ claims: Claim[], total: number, page: number, pages: number }> {
        let query: any = {};

        if (user.role === 'patient') {
            query.email = user.email;
        }

        if (filters) {
            if (filters.status) query.status = filters.status;
            if (filters.dateFrom || filters.dateTo) {
                query.submissionDate = {};
                if (filters.dateFrom) query.submissionDate.$gte = filters.dateFrom;
                if (filters.dateTo) query.submissionDate.$lte = filters.dateTo;
            }
            if (filters.amountMin || filters.amountMax) {
                query.claimAmount = {};
                if (filters.amountMin) query.claimAmount.$gte = filters.amountMin;
                if (filters.amountMax) query.claimAmount.$lte = filters.amountMax;
            }
        }

        const skip = (page - 1) * limit;
        const [claims, total] = await Promise.all([
            this.claimModel.find(query)
                .sort({ submissionDate: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.claimModel.countDocuments(query).exec()
        ]);

        return {
            claims,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    }

    async findOne(id: string, user: any): Promise<Claim> {
        const claim = await this.claimModel.findById(id).exec();
        if (!claim) {
            throw new NotFoundException('Claim not found');
        }
        if (user.role === 'patient' && claim.email !== user.email) {
            throw new UnauthorizedException('Unauthorized access');
        }
        return claim;
    }

    async update(id: string, updateClaimDto: UpdateClaimDto, user: any): Promise<Claim> {
        if (user.role !== 'insurer') {
            throw new UnauthorizedException('Only insurers can update claims');
        }
        const updatedClaim = await this.claimModel.findByIdAndUpdate(id, updateClaimDto, { new: true });
        if (!updatedClaim) {
            throw new NotFoundException('Claim not found');
        }
        return updatedClaim;
    }
}