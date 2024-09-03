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

import { AuthGuard } from "../../common/guards";
import { IRequestUser } from "../../common/interfaces";

import { CreateTaskReqDto, CreateTaskResDto, UpdateTaskReqDto } from "./dto";
import { TaskService } from "./task.service";

@Controller("tasks")
@UseGuards(AuthGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async createTask(
        @Request() req: { user: IRequestUser },
        @Body() createTaskReqDto: CreateTaskReqDto,
    ): Promise<CreateTaskResDto> {
        const { email } = req.user;
        return this.taskService.createTask(email, createTaskReqDto);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getTasks(@Request() req: { user: IRequestUser }) {
        const { email } = req.user;
        return this.taskService.getTasks(email);
    }

    @Get(":uuid")
    @HttpCode(HttpStatus.OK)
    async getTaskByUuid(
        @Request() req: { user: IRequestUser },
        @Param("uuid") uuid: string,
    ) {
        const { email } = req.user;
        return this.taskService.getTaskByUuid(email, uuid);
    }

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
