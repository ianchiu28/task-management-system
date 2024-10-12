import { Test, TestingModule } from "@nestjs/testing";

import { AuthGuard } from "../../common/guards";

import {
    CreateUserReqDto,
    ChangePasswordReqDto,
    DeleteUserReqDto,
    LoginReqDto,
} from "./dto";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("UserController", () => {
    let controller: UserController;

    const mockUserService = {
        createUser: jest.fn(),
        login: jest.fn(),
        changePassword: jest.fn(),
        deleteUser: jest.fn(),
    };

    const mockAuthGuard = {
        canActivate: jest.fn(() => true),
    };

    const email = "test@example.com";
    const username = "test";
    const password = "password";
    const req = { user: { email } };
    const accessToken = "accessToken";

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
        })
            .overrideProvider(UserService)
            .useValue(mockUserService)
            .overrideGuard(AuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        controller = module.get<UserController>(UserController);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        const createUserDto: CreateUserReqDto = {
            email,
            username,
            password,
        };

        it("should create a user", async () => {
            mockUserService.createUser.mockResolvedValue(undefined);

            const result = await controller.createUser(createUserDto);

            expect(result).toBeUndefined();
            expect(mockUserService.createUser).toHaveBeenCalledWith(
                createUserDto,
            );
        });
    });

    describe("changePassword", () => {
        const changePasswordDto: ChangePasswordReqDto = {
            oldPassword: password,
            newPassword: password,
        };

        it("should change user password", async () => {
            mockUserService.changePassword.mockResolvedValue(undefined);

            const result = await controller.changePassword(
                req,
                changePasswordDto,
            );

            expect(result).toBeUndefined();
            expect(mockUserService.changePassword).toHaveBeenCalledWith(
                email,
                changePasswordDto,
            );
        });
    });

    describe("deleteUser", () => {
        const deleteUserDto: DeleteUserReqDto = {
            password,
        };

        it("should delete a user", async () => {
            mockUserService.deleteUser.mockResolvedValue(undefined);

            const result = await controller.deleteUser(req, deleteUserDto);

            expect(result).toBeUndefined();
            expect(mockUserService.deleteUser).toHaveBeenCalledWith(
                email,
                deleteUserDto,
            );
        });
    });

    describe("login", () => {
        const loginReqDto: LoginReqDto = {
            email,
            password,
        };

        it("should login a user", async () => {
            mockUserService.login.mockResolvedValue(accessToken);

            const result = await controller.login(loginReqDto);

            expect(result).toEqual({ accessToken });
            expect(mockUserService.login).toHaveBeenCalledWith(loginReqDto);
        });
    });
});
