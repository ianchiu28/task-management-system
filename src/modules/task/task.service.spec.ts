import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { UserRepository } from "../user/user.repository";

import { CreateTaskReqDto, UpdateTaskReqDto } from "./dto";
import { TaskRepository } from "./task.repository";
import { TaskService } from "./task.service";

describe("TaskService", () => {
    let service: TaskService;

    const mockTaskRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    const mockUserRepository = {
        findOne: jest.fn(),
    };

    const email = "test@example.com";
    const uuid = "test-uuid";
    const title = "Test Task";
    const description = "Test Description";
    const status = "inProgress";

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TaskService, TaskRepository, UserRepository],
        })
            .overrideProvider(TaskRepository)
            .useValue(mockTaskRepository)
            .overrideProvider(UserRepository)
            .useValue(mockUserRepository)
            .compile();

        service = module.get<TaskService>(TaskService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createTask", () => {
        const createTaskDto: CreateTaskReqDto = {
            title,
            description,
        };
        const user = { id: 1, email };
        const task = { uuid, ...createTaskDto };

        it("should throw NotFoundException if user is not found", async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(
                service.createTask(email, createTaskDto),
            ).rejects.toThrow(NotFoundException);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { email },
            });
            expect(mockTaskRepository.create).not.toHaveBeenCalled();
            expect(mockTaskRepository.save).not.toHaveBeenCalled();
        });

        it("should create a task successfully", async () => {
            mockUserRepository.findOne.mockResolvedValue(user);
            mockTaskRepository.create.mockReturnValue(task);
            mockTaskRepository.save.mockResolvedValue(task);

            const result = await service.createTask(email, createTaskDto);

            expect(result).toEqual({ uuid });
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { email },
            });
            expect(mockTaskRepository.create).toHaveBeenCalledWith({
                ...createTaskDto,
                user: { id: user.id },
            });
            expect(mockTaskRepository.save).toHaveBeenCalledWith(task);
        });
    });

    describe("getTasks", () => {
        const tasks = [
            { uuid: `${uuid}-1`, title, description },
            { uuid: `${uuid}-2`, title, description },
        ];

        it("should return all tasks for a user", async () => {
            mockTaskRepository.find.mockResolvedValue(tasks);

            const result = await service.getTasks(email);

            expect(result).toEqual({ tasks });
            expect(mockTaskRepository.find).toHaveBeenCalledWith({
                where: { user: { email } },
            });
        });
    });

    describe("getTaskByUuid", () => {
        const task = { uuid, title, description };

        it("should throw NotFoundException if task is not found", async () => {
            mockTaskRepository.findOne.mockResolvedValue(null);

            await expect(service.getTaskByUuid(email, uuid)).rejects.toThrow(
                NotFoundException,
            );
            expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
                where: { uuid, user: { email } },
            });
        });

        it("should return a task by uuid", async () => {
            mockTaskRepository.findOne.mockResolvedValue(task);

            const result = await service.getTaskByUuid(email, uuid);

            expect(result).toEqual(task);
            expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
                where: { uuid, user: { email } },
            });
        });
    });

    describe("updateTask", () => {
        const updateTaskDto: UpdateTaskReqDto = {
            title,
            description,
            status,
        };
        const task = { uuid, ...updateTaskDto };

        it("should throw NotFoundException if task is not found", async () => {
            mockTaskRepository.findOne.mockResolvedValue(null);

            await expect(
                service.updateTask(email, uuid, updateTaskDto),
            ).rejects.toThrow(NotFoundException);
            expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
                where: { uuid, user: { email } },
            });
            expect(mockTaskRepository.save).not.toHaveBeenCalled();
        });

        it("should update a task successfully", async () => {
            mockTaskRepository.findOne.mockResolvedValue(task);
            mockTaskRepository.save.mockResolvedValue(task);

            await service.updateTask(email, uuid, updateTaskDto);

            expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
                where: { uuid, user: { email } },
            });
            expect(mockTaskRepository.save).toHaveBeenCalledWith(task);
        });
    });

    describe("deleteTask", () => {
        const task = { uuid, title, description };

        it("should throw NotFoundException if task is not found", async () => {
            mockTaskRepository.findOne.mockResolvedValue(null);

            await expect(service.deleteTask(email, uuid)).rejects.toThrow(
                NotFoundException,
            );
            expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
                where: { uuid, user: { email } },
            });
            expect(mockTaskRepository.remove).not.toHaveBeenCalled();
        });

        it("should delete a task successfully", async () => {
            mockTaskRepository.findOne.mockResolvedValue(task);
            mockTaskRepository.remove.mockResolvedValue(task);

            await service.deleteTask(email, uuid);

            expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
                where: { uuid, user: { email } },
            });
            expect(mockTaskRepository.remove).toHaveBeenCalledWith(task);
        });
    });
});
