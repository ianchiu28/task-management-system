import {
    IsString,
    IsNotEmpty,
    Length,
    IsOptional,
    IsUUID,
} from "class-validator";

export class CreateTaskReqDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    title: string;

    @IsString()
    @IsOptional()
    @Length(1, 500)
    description: string;
}

export class CreateTaskResDto {
    @IsUUID()
    @IsNotEmpty()
    uuid: string;
}
