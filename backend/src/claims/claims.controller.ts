import { Controller, Get, Post, Put, Param, Body, UploadedFile, UseInterceptors, Req, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimDto } from './dto/update-claim.dto';
import { ClaimFiltersDto } from './dto/claim-filters.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request, Express } from 'express';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt.guard';

interface AuthenticatedUser {
    userId: string;
    email: string;
    role: string;
}

@Controller('claims')
@UseGuards(JwtAuthGuard)
export class ClaimsController {
    constructor(private readonly claimsService: ClaimsService) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('document', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    const fileExtension = extname(file.originalname);
                    callback(null, `${randomName}${fileExtension}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                const acceptedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
                const fileExtension = extname(file.originalname).toLowerCase();

                if (!acceptedExtensions.includes(fileExtension)) {
                    return callback(
                        new BadRequestException(
                            `Invalid file type. Accepted types: ${acceptedExtensions.join(', ')}`
                        ),
                        false
                    );
                }

                callback(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB
            },
        }),
    )
    async create(
        @Body() createClaimDto: CreateClaimDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request,
    ) {
        const user = req['user'] as AuthenticatedUser;
        const claimData = { ...createClaimDto, email: user.email };
        return this.claimsService.create(claimData, file ? file.path : undefined);
    }

    @Get()
    async findAll(
        @Req() req: Request,
        @Query() filters: ClaimFiltersDto,
    ) {
        const user = req['user'] as AuthenticatedUser;
        const filterObject = {
            status: filters.status,
            dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
            dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
            amountMin: filters.amountMin,
            amountMax: filters.amountMax,
        };

        return this.claimsService.findAllPaginated(
            user,
            filterObject,
            filters.page || 1,
            filters.limit || 10
        );
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request) {
        const user = req['user'] as AuthenticatedUser;
        return this.claimsService.findOne(id, user);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateClaimDto: UpdateClaimDto,
        @Req() req: Request,
    ) {
        const user = req['user'] as AuthenticatedUser;
        return this.claimsService.update(id, updateClaimDto, user);
    }
}