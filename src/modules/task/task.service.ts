import { Injectable, NotFoundException } from "@nestjs/common";

import { ERROR_PREFIX } from "../../common/constants";
import { UserRepository } from "../user/user.repository";

import {
    CreateTaskReqDto,
    CreateTaskResDto,
    ReadTasksResDto,
    ReadTaskResDto,
    UpdateTaskReqDto,
} from "./dto";
import { TaskRepository } from "./task.repository";

@Injectable()
export class TaskService {
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async createTask(
        email: string,
        createTaskReqDto: CreateTaskReqDto,
    ): Promise<CreateTaskResDto> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException(
                `${ERROR_PREFIX.NOT_FOUND}: User not found`,
            );
        }

        const task = await this.taskRepository.create({
            ...createTaskReqDto,
            user: { id: user.id },
        });
        await this.taskRepository.save(task);

        return { uuid: task.uuid };
    }

    async getTasks(email: string): Promise<ReadTasksResDto> {
        const tasks = await this.taskRepository.find({
            where: { user: { email } },
        });
        return { tasks };
    }

    async getTaskByUuid(email: string, uuid: string): Promise<ReadTaskResDto> {
        const task = await this.taskRepository.findOne({
            where: { uuid, user: { email } },
        });

        if (!task) {
            throw new NotFoundException(
                `${ERROR_PREFIX.NOT_FOUND}: Task not found`,
            );
        }

        return task;
    }

    async updateTask(
        email: string,
        uuid: string,
        updateTaskReqDto: UpdateTaskReqDto,
    ): Promise<void> {
        const task = await this.taskRepository.findOne({
            where: { uuid, user: { email } },
        });

        if (!task) {
            throw new NotFoundException(
                `${ERROR_PREFIX.NOT_FOUND}: Task not found`,
            );
        }

        Object.assign(task, updateTaskReqDto);
        await this.taskRepository.save(task);
    }

//     async deleteTask(email: string, uuid: string): Promise<void> {
//         const task = await this.getTaskById(email, uuid);
//         await this.taskRepository.remove(task);
//     }
}
