import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
    @IsEmail({}, { message: 'Enter correct email.' })
    email: string;

    @MinLength(8, { message: 'The password is too short.' })
    @IsString({ message: 'Set password.' })
    password: string;
}
