import { Injectable, BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto";
import { UserRepository } from "./user.repository";
import { ERROR_PREFIX } from "src/common/constants";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(createUserDto: CreateUserDto): Promise<void> {
        // Check if user already exists
        const isUserExist = await this.userRepository.exists({
            where: { email: createUserDto.email },
        });
        if (isUserExist) {
            throw new BadRequestException(`
                ${ERROR_PREFIX.RESOURCE_DUPLICATED}: User already exists
            `);
        }

        // Make salt and hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        // Create user and save it
        const user = this.userRepository.create({
            ...createUserDto,
            salt,
            password: hashedPassword,
        });

        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.message.includes("duplicate key")) {
                throw new BadRequestException(`
                    ${ERROR_PREFIX.RESOURCE_DUPLICATED}: User already exists
                `);
            }

            throw error;
        }
    }

    changePassword(): string[] {
        return null;
    }

    deleteUser(): string {
        return null;
    }

    login(): string {
        return null;
    }
}
