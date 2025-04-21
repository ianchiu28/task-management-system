import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserReqDto {
    @ApiProperty({
        description: "User's email address",
        example: "user@example.com",
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: "User's username",
        example: "john_doe",
        minLength: 1,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    username: string;

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
