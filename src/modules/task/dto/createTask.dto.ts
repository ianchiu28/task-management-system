import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    Length,
    IsOptional,
    IsUUID,
} from "class-validator";

export class CreateTaskReqDto {
    @ApiProperty({
        description: "Task title",
        example: "Complete project documentation",
        minLength: 1,
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    title: string;

    @ApiProperty({
        description: "Task description",
        example: "Write detailed documentation for the project",
        minLength: 1,
        maxLength: 500,
        required: false,
    })
    @IsString()
    @IsOptional()
    @Length(1, 500)
    description: string;
}

export class CreateTaskResDto {
    @ApiProperty({
        description: "Task UUID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @IsUUID()
    @IsNotEmpty()
    uuid: string;
}
