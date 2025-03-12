import { IsString, IsNumber, IsPositive, IsOptional, IsEnum } from 'class-validator';

export class UpdateClaimDto {
    @IsOptional()
    @IsEnum(['Pending', 'Approved', 'Rejected'], { message: 'Status must be Pending, Approved, or Rejected' })
    readonly status?: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    readonly approvedAmount?: number;

    @IsOptional()
    @IsString()
    readonly insurerComments?: string;
}