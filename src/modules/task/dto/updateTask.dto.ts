import {
    IsString,
    IsNotEmpty,
    Length,
    IsOptional,
    IsIn,
} from "class-validator";

export class UpdateTaskReqDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    title: string;

    @IsString()
    @IsOptional()
    @Length(1, 500)
    description: string;

    @IsString()
    @IsOptional()
    @IsIn(["pending", "inProgress", "completed"])
    status: string;
}
