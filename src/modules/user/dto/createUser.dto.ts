import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    password: string;
}
