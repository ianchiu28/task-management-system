import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    IsUUID,
    IsString,
    IsNotEmpty,
    IsDate,
    IsArray,
    ValidateNested,
} from "class-validator";

export class ReadTaskResDto {
    @ApiProperty({
        description: "Task UUID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @IsUUID()
    @IsNotEmpty()
    uuid: string;

    @ApiProperty({
        description: "Task title",
        example: "Complete project documentation",
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: "Task description",
        example: "Write detailed documentation for the project",
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: "Task creation timestamp",
        example: "2024-01-01T00:00:00.000Z",
    })
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        description: "Task last update timestamp",
        example: "2024-01-01T00:00:00.000Z",
    })
    @IsDate()
    updatedAt: Date;
}

export class ReadTasksResDto {
    @ApiProperty({
        description: "List of tasks",
        type: [ReadTaskResDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReadTaskResDto)
    tasks: ReadTaskResDto[];
}
