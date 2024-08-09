import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserReqDto, LoginDto } from "./dto";
import { UserRepository } from "./user.repository";
import { ERROR_PREFIX } from "src/common/constants";
import * as jwt from "jsonwebtoken";

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async createUser(createUserReqDto: CreateUserReqDto): Promise<void> {
        const { email, password } = createUserReqDto;
        const duplicatedError = new BadRequestException(`
            ${ERROR_PREFIX.RESOURCE_DUPLICATED}: User already exists
        `);

        // Check if user already exists
        const isUserExist = await this.userRepository.isExist(email);
        if (isUserExist) throw duplicatedError;

        // Make salt and hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user and save it
        const user = this.userRepository.create({
            ...createUserReqDto,
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
