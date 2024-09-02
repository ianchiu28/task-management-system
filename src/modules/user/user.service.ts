import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { ERROR_PREFIX } from "../../common/constants";

import { CreateUserReqDto, LoginReqDto, ChangePasswordReqDto } from "./dto";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: UserRepository,
    ) {}

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

    async changePassword(
        email: string,
        changePasswordDto: ChangePasswordReqDto,
    ): Promise<void> {
        const { oldPassword, newPassword } = changePasswordDto;

        console.log(email, oldPassword, newPassword);
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
        const options = { subject: email };
        const accessToken = await this.jwtService.signAsync({}, options);

        return accessToken;
    }
}
