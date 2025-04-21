import { ApiProperty } from "@nestjs/swagger";
import {
    IsString,
    IsNotEmpty,
    Length,
    IsOptional,
    IsIn,
} from "class-validator";

export class UpdateTaskReqDto {
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

    @ApiProperty({
        description: "Task status",
        example: "inProgress",
        enum: ["pending", "inProgress", "completed"],
        required: false,
    })
    @IsString()
    @IsOptional()
    @IsIn(["pending", "inProgress", "completed"])
    status: string;
}
