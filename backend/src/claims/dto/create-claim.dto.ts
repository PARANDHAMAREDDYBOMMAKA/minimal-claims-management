import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateClaimDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsNumber()
    @IsPositive()
    @Type(() => Number) 
    claimAmount: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}