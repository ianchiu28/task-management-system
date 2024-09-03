import { Injectable/*, NotFoundException*/ } from "@nestjs/common";

import { TaskRepository } from "./task.repository";
// import { CreateTaskDto, UpdateTaskDto } from "./dto";
// import { TaskEntity } from "./task.entity";
// import { ERROR_PREFIX } from '../../common/constants';

@Injectable()
export class TaskService {
    constructor(private readonly taskRepository: TaskRepository) {}

//     async createTask(email: string, createTaskDto: CreateTaskDto): Promise<TaskEntity> {
//         return this.taskRepository.createTask(email, createTaskDto);
//     }

//     async getTasks(email: string): Promise<TaskEntity[]> {
//         return this.taskRepository.find({ where: { userEmail: email } });
//     }

//     async getTaskById(email: string, uuid: string): Promise<TaskEntity> {
//         const task = await this.taskRepository.findOne({ where: { uuid, userEmail: email } });
//         if (!task) {
//             throw new NotFoundException(`${ERROR_PREFIX.NOT_FOUND}: Task not found`);
//         }
//         return task;
//     }

//     async updateTask(email: string, uuid: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
//         const task = await this.getTaskById(email, uuid);
//         Object.assign(task, updateTaskDto);
//         return this.taskRepository.save(task);
//     }

//     async deleteTask(email: string, uuid: string): Promise<void> {
//         const task = await this.getTaskById(email, uuid);
//         await this.taskRepository.remove(task);
//     }
}
