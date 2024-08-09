import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserReqDto, LoginReqDto } from "./dto";
import { UserRepository } from "./user.repository";
import { ERROR_PREFIX } from "src/common/constants";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
    #jwtSecret: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepository,
    ) {
        this.#jwtSecret = this.configService.get<string>("JWT_SECRET");
    }

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

    async login(loginReqDto: LoginReqDto): Promise<string> {
        const { email, password } = loginReqDto;

        // Get salt and hashed password by email
        const { salt, password: dbPassword } =
            await this.userRepository.getPasswordInfo(email);

        // Make hash password
        const hashedPassword = await bcrypt.hash(password, salt);

        if (hashedPassword !== dbPassword) {
            throw new UnauthorizedException(`
                ${ERROR_PREFIX.INVALID_CREDENTIALS}: Incorrect email or password
            `);
        }

        // Generate access token with expiration time
        const options = {
            issuer: "task-management",
            subject: email,
            expiresIn: "8h",
        };
        const accessToken = jwt.sign({}, this.#jwtSecret, options);

        return accessToken;
    }
}
