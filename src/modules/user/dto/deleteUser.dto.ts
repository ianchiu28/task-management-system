import { IsString, IsNotEmpty, Length } from "class-validator";

export class DeleteUserReqDto {
    @IsString()
    @IsNotEmpty()
    @Length(8, 100)
    password: string;
}
