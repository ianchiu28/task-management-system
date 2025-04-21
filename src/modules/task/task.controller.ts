import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiParam,
} from "@nestjs/swagger";

import { AuthGuard } from "../../common/guards";
import { IRequestUser } from "../../common/interfaces";

import { CreateTaskReqDto, CreateTaskResDto, UpdateTaskReqDto } from "./dto";
import { TaskService } from "./task.service";

@ApiTags("Tasks")
@ApiBearerAuth()
@Controller("tasks")
@UseGuards(AuthGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @ApiOperation({ summary: "Create a new task" })
    @ApiResponse({
        status: 200,
        description: "Task created successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Success",
                },
                data: {
                    type: "object",
                    properties: {
                        uuid: {
                            type: "string",
                            example: "123e4567-e89b-12d3-a456-426614174000",
                        },
                    },
                },
            },
        },
    })
    @Post()
    @HttpCode(HttpStatus.OK)
    async createTask(
        @Request() req: { user: IRequestUser },
        @Body() createTaskReqDto: CreateTaskReqDto,
    ): Promise<CreateTaskResDto> {
        const { email } = req.user;
        return this.taskService.createTask(email, createTaskReqDto);
    }

    @ApiOperation({ summary: "Get all tasks" })
    @ApiResponse({
        status: 200,
        description: "Tasks retrieved successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Success",
                },
                data: {
                    type: "object",
                    properties: {
                        tasks: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    uuid: {
                                        type: "string",
                                        example: "123e4567-e89b-12d3-a456-426614174000",
                                    },
                                    title: {
                                        type: "string",
                                        example: "Complete project documentation",
                                    },
                                    description: {
                                        type: "string",
                                        example: "Write detailed documentation for the project",
                                    },
                                    createdAt: {
                                        type: "string",
                                        example: "2024-01-01T00:00:00.000Z",
                                    },
                                    updatedAt: {
                                        type: "string",
                                        example: "2024-01-01T00:00:00.000Z",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    })
    @Get()
    @HttpCode(HttpStatus.OK)
    async getTasks(@Request() req: { user: IRequestUser }) {
        const { email } = req.user;
        return this.taskService.getTasks(email);
    }

    @ApiOperation({ summary: "Get task by UUID" })
    @ApiParam({
        name: "uuid",
        description: "Task UUID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: 200,
        description: "Task retrieved successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Success",
                },
                data: {
                    type: "object",
                    properties: {
                        uuid: {
                            type: "string",
                            example: "123e4567-e89b-12d3-a456-426614174000",
                        },
                        title: {
                            type: "string",
                            example: "Complete project documentation",
                        },
                        description: {
                            type: "string",
                            example: "Write detailed documentation for the project",
                        },
                        createdAt: {
                            type: "string",
                            example: "2024-01-01T00:00:00.000Z",
                        },
                        updatedAt: {
                            type: "string",
                            example: "2024-01-01T00:00:00.000Z",
                        },
                    },
                },
            },
        },
    })
    @Get(":uuid")
    @HttpCode(HttpStatus.OK)
    async getTaskByUuid(
        @Request() req: { user: IRequestUser },
        @Param("uuid") uuid: string,
    ) {
        const { email } = req.user;
        return this.taskService.getTaskByUuid(email, uuid);
    }

    @ApiOperation({ summary: "Update task" })
    @ApiParam({
        name: "uuid",
        description: "Task UUID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: 200,
        description: "Task updated successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Success",
                },
                data: {
                    type: "object",
                    properties: {
                        uuid: {
                            type: "string",
                            example: "123e4567-e89b-12d3-a456-426614174000",
                        },
                        title: {
                            type: "string",
                            example: "Complete project documentation",
                        },
                        description: {
                            type: "string",
                            example: "Write detailed documentation for the project",
                        },
                        createdAt: {
                            type: "string",
                            example: "2024-01-01T00:00:00.000Z",
                        },
                        updatedAt: {
                            type: "string",
                            example: "2024-01-01T00:00:00.000Z",
                        },
                    },
                },
            },
        },
    })
    @Patch(":uuid")
    @HttpCode(HttpStatus.OK)
    async updateTask(
        @Request() req: { user: IRequestUser },
        @Param("uuid") uuid: string,
        @Body() updateTaskReqDto: UpdateTaskReqDto,
    ) {
        const { email } = req.user;
        return this.taskService.updateTask(email, uuid, updateTaskReqDto);
    }

    @ApiOperation({ summary: "Delete task" })
    @ApiParam({
        name: "uuid",
        description: "Task UUID",
        example: "123e4567-e89b-12d3-a456-426614174000",
    })
    @ApiResponse({
        status: 200,
        description: "Task deleted successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Success",
                },
                data: {
                    type: "object",
                    example: {},
                },
            },
        },
    })
    @Delete(":uuid")
    @HttpCode(HttpStatus.OK)
    async deleteTask(
        @Request() req: { user: IRequestUser },
        @Param("uuid") uuid: string,
    ) {
        const { email } = req.user;
        await this.taskService.deleteTask(email, uuid);
    }
}
