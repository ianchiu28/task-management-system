import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "./user.entity";
import { UserRepository } from "./user.repository";

describe("UserRepository", () => {
    let userRepository: UserRepository;

    const mockRepository: Partial<Repository<UserEntity>> = {
        exists: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
    };

    const email = "test@example.com";

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserRepository,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        userRepository = module.get<UserRepository>(UserRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("isExist", () => {
        it("should return true if user exists", async () => {
            (mockRepository.exists as jest.Mock).mockResolvedValue(true);

            const result = await userRepository.isExist(email);

            expect(result).toBe(true);
            expect(mockRepository.exists).toHaveBeenCalledWith({
                where: { email },
            });
        });

        it("should return false if user does not exist", async () => {
            (mockRepository.exists as jest.Mock).mockResolvedValue(false);

            const result = await userRepository.isExist(email);

            expect(result).toBe(false);
            expect(mockRepository.exists).toHaveBeenCalledWith({
                where: { email },
            });
        });
    });

    describe("saveWithDuplicatedHandler", () => {
        const user = new UserEntity();
        const customError = new Error("Custom error");
        const originalError = new Error("Original error");

        it("should save user successfully", async () => {
            await userRepository.saveWithDuplicatedHandler(user, customError);

            expect(mockRepository.save).toHaveBeenCalledWith(user);
        });

        it("should throw custom error on duplicate key", async () => {
            (mockRepository.save as jest.Mock).mockRejectedValue({
                message: "duplicate key",
            });

            await expect(
                userRepository.saveWithDuplicatedHandler(user, customError),
            ).rejects.toThrow(customError);
        });

        it("should throw original error on other errors", async () => {
            (mockRepository.save as jest.Mock).mockRejectedValue(originalError);

            await expect(
                userRepository.saveWithDuplicatedHandler(user, customError),
            ).rejects.toThrow(originalError);
        });
    });

    describe("getPasswordInfo", () => {
        const email = "test@example.com";
        const passwordInfo = { salt: "salt", password: "hashedPassword" };

        it("should return password info for existing user", async () => {
            (mockRepository.findOne as jest.Mock).mockResolvedValue(
                passwordInfo,
            );

            const result = await userRepository.getPasswordInfo(email);

            expect(result).toEqual(passwordInfo);
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                select: { salt: true, password: true },
                where: { email },
            });
        });

        it("should return {} for non-existing user", async () => {
            (mockRepository.findOne as jest.Mock).mockResolvedValue({});

            const result = await userRepository.getPasswordInfo(email);

            expect(result).toEqual({});
            expect(mockRepository.findOne).toHaveBeenCalledWith({
                select: { salt: true, password: true },
                where: { email },
            });
        });
    });

    describe("updatePassword", () => {
        it("should update password successfully", async () => {
            const newHashedPassword = "newHashedPassword";
            const newSalt = "newSalt";

            await userRepository.updatePassword(
                email,
                newHashedPassword,
                newSalt,
            );

            expect(mockRepository.update).toHaveBeenCalledWith(
                { email },
                { password: newHashedPassword, salt: newSalt },
            );
        });
    });
});
