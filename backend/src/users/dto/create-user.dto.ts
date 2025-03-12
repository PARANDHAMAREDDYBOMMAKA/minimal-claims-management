import { IsEmail, IsString, MinLength, IsEnum, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    readonly name: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    @MinLength(6)
    readonly password: string;

    @IsEnum(['patient', 'insurer'], { message: 'Role must be either patient or insurer' })
    readonly role: 'patient' | 'insurer';
}