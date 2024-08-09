import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Patch,
    Body,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserReqDto, LoginDto } from "./dto";

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
    changePassword(@Body() changePasswordDto: string) {
        console.log(changePasswordDto);
        return this.userService.changePassword();
    }

    @Post("/delete-account")
    @HttpCode(HttpStatus.OK)
    deleteUser(@Body() deleteUserDto: string) {
        console.log(deleteUserDto);
        return this.userService.deleteUser();
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: string) {
        console.log(loginDto);
        return this.userService.login();
    }
}
