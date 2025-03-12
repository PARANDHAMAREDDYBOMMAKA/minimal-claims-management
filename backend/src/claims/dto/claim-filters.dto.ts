import { IsOptional, IsEnum, IsDateString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ClaimFiltersDto {
    @IsOptional()
    @IsEnum(['Pending', 'Approved', 'Rejected'], { message: 'Status must be Pending, Approved, or Rejected' })
    readonly status?: string;

    @IsOptional()
    @IsDateString()
    readonly dateFrom?: string;

    @IsOptional()
    @IsDateString()
    readonly dateTo?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    readonly amountMin?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    readonly amountMax?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    readonly page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    readonly limit?: number;
}