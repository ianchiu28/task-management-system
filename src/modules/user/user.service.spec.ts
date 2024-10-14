import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";

import {
    CreateUserReqDto,
    ChangePasswordReqDto,
    DeleteUserReqDto,
    LoginReqDto,
} from "./dto";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

describe("UserService", () => {
    let service: UserService;

    const mockUserRepository = {
        isExist: jest.fn(),
        create: jest.fn(),
        saveWithDuplicatedHandler: jest.fn(),
        getPasswordInfo: jest.fn(),
        updatePassword: jest.fn(),
        delete: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    const email = "test@example.com";
    const username = "test";
    const password = "password";
    const salt = "salt";
    const hashedPassword = "hashedPassword";

    let spyGenSalt: jest.SpyInstance;
    let spyHash: jest.SpyInstance;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, UserRepository, JwtService],
        })
            .overrideProvider(UserRepository)
            .useValue(mockUserRepository)
            .overrideProvider(JwtService)
            .useValue(mockJwtService)
            .compile();

        service = module.get<UserService>(UserService);

        spyGenSalt = jest.spyOn(bcrypt, "genSalt");
        spyGenSalt.mockResolvedValue(salt);

        spyHash = jest.spyOn(bcrypt, "hash");
        spyHash.mockResolvedValue(hashedPassword);
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

        it("should throw BadRequestException if user already exists", async () => {
            mockUserRepository.isExist.mockResolvedValue(true);

            await expect(service.createUser(createUserDto)).rejects.toThrow(
                BadRequestException,
            );
            expect(mockUserRepository.isExist).toHaveBeenCalledWith(email);
        });

        it("should create a user successfully", async () => {
            mockUserRepository.isExist.mockResolvedValue(false);
            mockUserRepository.create.mockReturnValue(createUserDto);
            mockUserRepository.saveWithDuplicatedHandler.mockResolvedValue(
                undefined,
            );

            await service.createUser(createUserDto);

            expect(mockUserRepository.isExist).toHaveBeenCalledWith(email);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                ...createUserDto,
                salt,
                password: hashedPassword,
            });
            expect(
                mockUserRepository.saveWithDuplicatedHandler,
            ).toHaveBeenCalled();
        });
    });

    describe("changePassword", () => {
        const changePasswordDto: ChangePasswordReqDto = {
            oldPassword: password,
            newPassword: "newPassword",
        };

        it("should throw UnauthorizedException if old password is incorrect", async () => {
            mockUserRepository.getPasswordInfo.mockResolvedValue({
                salt,
                password: hashedPassword + "123",
            });

            await expect(
                service.changePassword(email, changePasswordDto),
            ).rejects.toThrow(UnauthorizedException);
            expect(mockUserRepository.getPasswordInfo).toHaveBeenCalledWith(
                email,
            );
        });

        it("should change password successfully", async () => {
            mockUserRepository.getPasswordInfo.mockResolvedValue({
                salt,
                password: hashedPassword,
            });
            mockUserRepository.updatePassword.mockResolvedValue(undefined);

            await service.changePassword(email, changePasswordDto);

            expect(mockUserRepository.getPasswordInfo).toHaveBeenCalledWith(
                email,
            );
            expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(
                email,
                hashedPassword,
                salt,
            );
        });
    });

    describe("deleteUser", () => {
        const deleteUserDto: DeleteUserReqDto = {
            password,
        };

        it("should throw UnauthorizedException if password is incorrect", async () => {
            mockUserRepository.getPasswordInfo.mockResolvedValue({
                salt,
                password: hashedPassword + "123",
            });

            await expect(
                service.deleteUser(email, deleteUserDto),
            ).rejects.toThrow(UnauthorizedException);
            expect(mockUserRepository.getPasswordInfo).toHaveBeenCalledWith(
                email,
            );
        });

        it("should delete user successfully", async () => {
            mockUserRepository.getPasswordInfo.mockResolvedValue({
                salt,
                password: hashedPassword,
            });
            mockUserRepository.delete.mockResolvedValue(undefined);

            await service.deleteUser(email, deleteUserDto);

            expect(mockUserRepository.getPasswordInfo).toHaveBeenCalledWith(
                email,
            );
            expect(mockUserRepository.delete).toHaveBeenCalledWith({ email });
        });
    });

    describe("login", () => {
        const loginDto: LoginReqDto = {
            email,
            password,
        };

        it("should throw UnauthorizedException if user is not found", async () => {
            mockUserRepository.getPasswordInfo.mockResolvedValue({});

            await expect(service.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
            expect(mockUserRepository.getPasswordInfo).toHaveBeenCalledWith(
                email,
            );
        });

        it("should throw UnauthorizedException if password is incorrect", async () => {
            mockUserRepository.getPasswordInfo.mockResolvedValue({
                salt,
                password: hashedPassword + "123",
            });

            await expect(service.login(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
            expect(mockUserRepository.getPasswordInfo).toHaveBeenCalledWith(
                email,
            );
        });

        it("should return access token on successful login", async () => {
            const token = "accessToken";
            mockUserRepository.getPasswordInfo.mockResolvedValue({
                salt,
                password: hashedPassword,
            });
            mockJwtService.signAsync.mockReturnValue(token);

            const result = await service.login(loginDto);

            expect(result).toEqual(token);
            expect(mockUserRepository.getPasswordInfo).toHaveBeenCalledWith(
                email,
            );
            expect(mockJwtService.signAsync).toHaveBeenCalledWith(
                {},
                { subject: email },
            );
        });
    });
});
