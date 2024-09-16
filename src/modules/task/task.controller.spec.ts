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

    const email = "test@example.com";
    const req = { user: { email } };
    const title = "Test Task";
    const description = "Test Description";
    const status = "inProgress";
    const uuid = "test-uuid";

    beforeEach(async () => {
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

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createTask", () => {
        const createTaskReqDto: CreateTaskReqDto = {
            title,
            description,
        };
        const expectedResult = { uuid };

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

        it("should get all tasks for a user", async () => {
            mockTaskService.getTasks.mockResolvedValue(expectedResult);

            const result = await controller.getTasks(req);

            expect(result).toEqual(expectedResult);
            expect(mockTaskService.getTasks).toHaveBeenCalledWith(email);
        });
    });

    describe("getTaskByUuid", () => {
        const expectedResult = { uuid, title };

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
