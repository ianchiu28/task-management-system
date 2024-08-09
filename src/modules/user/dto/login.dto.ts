import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginReqDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    password: string;
}

export class LoginResDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}
