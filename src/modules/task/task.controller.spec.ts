import { Test, TestingModule } from "@nestjs/testing";

import { AuthGuard } from "../../common/guards";

import { CreateTaskReqDto, UpdateTaskReqDto } from "./dto";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

describe("TaskController", () => {
    let controller: TaskController;

    const mockTaskService = {
        createTask: jest.fn(),
        getTasks: jest.fn(),
        getTaskByUuid: jest.fn(),
        updateTask: jest.fn(),
        deleteTask: jest.fn(),
    };

    const mockAuthGuard = {
        canActivate: jest.fn(() => true),
    };

    const errorMessage = "Error message";
    const email = "test@example.com";
    const req = { user: { email } };
    const title = "Test Task";
    const description = "Test Description";
    const status = "inProgress";
    const uuid = "test-uuid";

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TaskController],
            providers: [TaskService],
        })
            .overrideProvider(TaskService)
            .useValue(mockTaskService)
            .overrideGuard(AuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        controller = module.get<TaskController>(TaskController);
    });

    describe("createTask", () => {
        const createTaskReqDto: CreateTaskReqDto = {
            title,
            description,
        };
        const expectedResult = { uuid };

        it("should throw an error when failed to create task", async () => {
            mockTaskService.createTask.mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(
                controller.createTask(req, createTaskReqDto),
            ).rejects.toThrow(errorMessage);
            expect(mockTaskService.createTask).toHaveBeenCalledWith(
                email,
                createTaskReqDto,
            );
        });

        it("should create a task", async () => {
            mockTaskService.createTask.mockResolvedValue(expectedResult);

            const result = await controller.createTask(req, createTaskReqDto);

            expect(result).toEqual(expectedResult);
            expect(mockTaskService.createTask).toHaveBeenCalledWith(
                email,
                createTaskReqDto,
            );
        });
    });

    describe("getTasks", () => {
        const expectedResult = {
            tasks: [{ uuid, title }],
        };

        it("should throw error when failed to get tasks", async () => {
            mockTaskService.getTasks.mockRejectedValue(new Error(errorMessage));

            await expect(controller.getTasks(req)).rejects.toThrow(
                errorMessage,
            );
            expect(mockTaskService.getTasks).toHaveBeenCalledWith(email);
        });

        it("should get all tasks for a user", async () => {
            mockTaskService.getTasks.mockResolvedValue(expectedResult);

            const result = await controller.getTasks(req);

            expect(result).toEqual(expectedResult);
            expect(mockTaskService.getTasks).toHaveBeenCalledWith(email);
        });
    });

    describe("getTaskByUuid", () => {
        const expectedResult = { uuid, title };

        it("should throw error when failed to get task by uuid", async () => {
            mockTaskService.getTaskByUuid.mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(controller.getTaskByUuid(req, uuid)).rejects.toThrow(
                errorMessage,
            );
            expect(mockTaskService.getTaskByUuid).toHaveBeenCalledWith(
                email,
                uuid,
            );
        });

        it("should get a task by uuid", async () => {
            mockTaskService.getTaskByUuid.mockResolvedValue(expectedResult);

            const result = await controller.getTaskByUuid(req, uuid);

            expect(result).toEqual(expectedResult);
            expect(mockTaskService.getTaskByUuid).toHaveBeenCalledWith(
                email,
                uuid,
            );
        });
    });

    describe("updateTask", () => {
        const updateTaskDto: UpdateTaskReqDto = {
            title,
            description,
            status,
        };
        const expectedResult = { uuid, title };

        it("should throw error when failed to update task", async () => {
            mockTaskService.updateTask.mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(
                controller.updateTask(req, uuid, updateTaskDto),
            ).rejects.toThrow(errorMessage);
            expect(mockTaskService.updateTask).toHaveBeenCalledWith(
                email,
                uuid,
                updateTaskDto,
            );
        });

        it("should update a task", async () => {
            mockTaskService.updateTask.mockResolvedValue(expectedResult);

            const result = await controller.updateTask(
                req,
                uuid,
                updateTaskDto,
            );

            expect(result).toEqual(expectedResult);
            expect(mockTaskService.updateTask).toHaveBeenCalledWith(
                email,
                uuid,
                updateTaskDto,
            );
        });
    });

    describe("deleteTask", () => {
        it("should throw error when failed to delete task", async () => {
            mockTaskService.deleteTask.mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(controller.deleteTask(req, uuid)).rejects.toThrow(
                errorMessage,
            );
            expect(mockTaskService.deleteTask).toHaveBeenCalledWith(
                email,
                uuid,
            );
        });

        it("should delete a task", async () => {
            mockTaskService.deleteTask.mockResolvedValue(null);

            await controller.deleteTask(req, uuid);

            expect(mockTaskService.deleteTask).toHaveBeenCalledWith(
                email,
                uuid,
            );
        });
    });
});
