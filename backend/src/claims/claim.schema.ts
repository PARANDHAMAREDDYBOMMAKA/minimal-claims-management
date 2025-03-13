import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClaimDocument = Claim & Document;

@Schema()
export class Claim {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    claimAmount: number;

    @Prop({ required: true })
    description: string;
    @Prop({ required: true })
    document: string;

    @Prop({ default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] })
    status: string;

    @Prop({ default: Date.now })
    submissionDate: Date;

    @Prop()
    approvedAmount?: number;

    @Prop()
    insurerComments?: string;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);