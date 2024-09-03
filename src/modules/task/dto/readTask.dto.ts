import { Type } from "class-transformer";
import {
    IsUUID,
    IsString,
    IsNotEmpty,
    IsDate,
    IsArray,
    ValidateNested,
} from "class-validator";

export class TaskDto {
    @IsUUID()
    @IsNotEmpty()
    uuid: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    description: string;

    @IsDate()
    createdAt: Date;

    @IsDate()
    updatedAt: Date;
}

export class ReadTasksResDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TaskDto)
    tasks: TaskDto[];
}
