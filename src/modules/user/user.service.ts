import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { ERROR_PREFIX } from "../../common/constants";

import {
    CreateUserReqDto,
    LoginReqDto,
    ChangePasswordReqDto,
    DeleteUserReqDto,
} from "./dto";
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

        // Get user's current password info
        const { salt, password: currentHashedPassword } =
            await this.userRepository.getPasswordInfo(email);

        // Verify old password
        const hashedOldPassword = await bcrypt.hash(oldPassword, salt);
        if (hashedOldPassword !== currentHashedPassword) {
            throw new UnauthorizedException(`
                ${ERROR_PREFIX.INVALID_CREDENTIALS}: Incorrect old password
            `);
        }

        // Generate new salt and hash new password
        const newSalt = await bcrypt.genSalt();
        const newHashedPassword = await bcrypt.hash(newPassword, newSalt);

        // Update user's password in the repository
        await this.userRepository.updatePassword(
            email,
            newHashedPassword,
            newSalt,
        );
    }

    async deleteUser(
        email: string,
        deleteUserDto: DeleteUserReqDto,
    ): Promise<void> {
        const { password } = deleteUserDto;

        // Get user's current password info
        const { salt, password: currentHashedPassword } =
            await this.userRepository.getPasswordInfo(email);

        // Verify password
        const hashedPassword = await bcrypt.hash(password, salt);
        if (hashedPassword !== currentHashedPassword) {
            throw new UnauthorizedException(`
                ${ERROR_PREFIX.INVALID_CREDENTIALS}: Incorrect password
            `);
        }

        // Delete user
        await this.userRepository.delete({ email });
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
