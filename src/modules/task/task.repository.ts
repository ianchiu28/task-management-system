import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TaskEntity } from "./task.entity";

export class TaskRepository extends Repository<TaskEntity> {
    constructor(
        @InjectRepository(TaskEntity)
        private taskRepository: Repository<TaskEntity>,
    ) {
        super(
            taskRepository.target,
            taskRepository.manager,
            taskRepository.queryRunner,
        );
    }
}
