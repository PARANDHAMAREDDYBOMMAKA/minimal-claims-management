import { IsString, IsEmail, IsNumber, IsPositive, MinLength, MaxLength } from 'class-validator';

export class CreateClaimDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    readonly name: string;

    @IsEmail()
    readonly email: string;

    @IsNumber()
    @IsPositive()
    readonly claimAmount: number;

    @IsString()
    @MinLength(10)
    @MaxLength(1000)
    readonly description: string;
}