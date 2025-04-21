import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginReqDto {
    @ApiProperty({
        description: "User's email address",
        example: "user@example.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "User's password",
        example: "password123",
        minLength: 8,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    password: string;
}

export class LoginResDto {
    @ApiProperty({
        description: "JWT access token",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}
