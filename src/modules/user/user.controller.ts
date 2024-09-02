import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Patch,
    Body,
    UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "../../common/guards";

import { CreateUserReqDto, LoginReqDto, LoginResDto } from "./dto";
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
    changePassword(@Body() changePasswordDto: string) {
        console.log(changePasswordDto);
        return this.userService.changePassword();
    }

    @Post("delete-account")
    @HttpCode(HttpStatus.OK)
    deleteUser(@Body() deleteUserDto: string) {
        console.log(deleteUserDto);
        return this.userService.deleteUser();
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginReqDto: LoginReqDto): Promise<LoginResDto> {
        const accessToken = await this.userService.login(loginReqDto);
        return { accessToken };
    }
}
