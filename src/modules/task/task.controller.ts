import {
    Controller,
//     Get,
//     Post,
//     Put,
//     Delete,
//     Body,
//     Param,
    UseGuards,
//     Request,
//     HttpCode,
//     HttpStatus,
} from "@nestjs/common";

import { AuthGuard } from "../../common/guards";
// import { IRequestUser } from "../../common/interfaces";

import { TaskService } from "./task.service";
// import { CreateTaskDto, UpdateTaskDto } from "./dto";

@Controller("tasks")
@UseGuards(AuthGuard)
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

//     @Post()
//     @HttpCode(HttpStatus.CREATED)
//     async createTask(
//         @Request() req: { user: IRequestUser },
//         @Body() createTaskDto: CreateTaskDto
//     ) {
//         const { email } = req.user;
//         return this.taskService.createTask(email, createTaskDto);
//     }

//     @Get()
//     @HttpCode(HttpStatus.OK)
//     async getTasks(@Request() req: { user: IRequestUser }) {
//         const { email } = req.user;
//         return this.taskService.getTasks(email);
//     }

//     @Get(":uuid")
//     @HttpCode(HttpStatus.OK)
//     async getTaskById(
//         @Request() req: { user: IRequestUser },
//         @Param("uuid") uuid: string
//     ) {
//         const { email } = req.user;
//         return this.taskService.getTaskById(email, uuid);
//     }

//     @Put(":uuid")
//     @HttpCode(HttpStatus.OK)
//     async updateTask(
//         @Request() req: { user: IRequestUser },
//         @Param("uuid") uuid: string,
//         @Body() updateTaskDto: UpdateTaskDto
//     ) {
//         const { email } = req.user;
//         return this.taskService.updateTask(email, uuid, updateTaskDto);
//     }

//     @Delete(":uuid")
//     @HttpCode(HttpStatus.NO_CONTENT)
//     async deleteTask(
//         @Request() req: { user: IRequestUser },
//         @Param("uuid") uuid: string
//     ) {
//         const { email } = req.user;
//         await this.taskService.deleteTask(email, uuid);
//     }
}
