import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Patch,
    Body,
    UseGuards,
    Request,
} from "@nestjs/common";

import { AuthGuard } from "../../common/guards";
import { IRequestUser } from "../../common/interfaces";

import {
    CreateUserReqDto,
    LoginReqDto,
    LoginResDto,
    ChangePasswordReqDto,
    DeleteUserReqDto,
} from "./dto";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async createUser(
        @Body() createUserReqDto: CreateUserReqDto,
    ): Promise<void> {
        await this.userService.createUser(createUserReqDto);
    }

    @Patch("password")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async changePassword(
        @Request() req: { user: IRequestUser },
        @Body() changePasswordDto: ChangePasswordReqDto,
    ) {
        const { email } = req.user;
        await this.userService.changePassword(email, changePasswordDto);
    }

    @Post("delete")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    deleteUser(
        @Request() req: { user: IRequestUser },
        @Body() deleteUserDto: DeleteUserReqDto,
    ) {
        const { email } = req.user;
        return this.userService.deleteUser(email, deleteUserDto);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginReqDto: LoginReqDto): Promise<LoginResDto> {
        const accessToken = await this.userService.login(loginReqDto);
        return { accessToken };
    }
}
