import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length } from "class-validator";

export class DeleteUserReqDto {
    @ApiProperty({
        description: "User's password for verification",
        example: "password123",
        minLength: 8,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    password: string;
}
