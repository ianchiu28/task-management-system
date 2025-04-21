import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length } from "class-validator";

export class ChangePasswordReqDto {
    @ApiProperty({
        description: "Current password",
        example: "oldPassword123",
        minLength: 8,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    oldPassword: string;

    @ApiProperty({
        description: "New password",
        example: "newPassword123",
        minLength: 8,
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    newPassword: string;
}
