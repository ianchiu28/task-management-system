import { Injectable, BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto";
import { UserRepository } from "./user.repository";
import { ERROR_PREFIX } from "src/common/constants";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(createUserDto: CreateUserDto): Promise<void> {
        const { email, password } = createUserDto;
        const duplicatedError = new BadRequestException(`
            ${ERROR_PREFIX.RESOURCE_DUPLICATED}: User already exists
        `);

        // Check if user already exists
        const isUserExist = await this.userRepository.isExistByEmail(email);
        if (isUserExist) throw duplicatedError;

        // Make salt and hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user and save it
        const user = this.userRepository.create({
            ...createUserDto,
            salt,
            password: hashedPassword,
        });
        await this.userRepository.saveWithDuplicatedHandler(
            user,
            duplicatedError,
        );
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
