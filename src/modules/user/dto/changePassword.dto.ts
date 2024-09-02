import { IsString, IsNotEmpty, Length } from "class-validator";

export class ChangePasswordReqDto {
    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    oldPassword: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    newPassword: string;
}
