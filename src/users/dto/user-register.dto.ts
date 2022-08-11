import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
    @IsEmail({}, { message: 'Enter correct email.' })
    email: string;

    @MinLength(8, { message: 'The password is too short.' })
    @IsString({ message: 'Set password.' })
    password: string;

    @MinLength(4, { message: 'The name is too short' })
    @IsString({ message: 'Enter your name.' })
    name: string;
}
