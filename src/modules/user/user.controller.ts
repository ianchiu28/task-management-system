import { Controller, Post, Patch, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Patch("password")
    changePassword(@Body() changePasswordDto: string) {
        console.log(changePasswordDto);
        return this.userService.changePassword();
    }

    @Post("/delete-account")
    deleteUser(@Body() deleteUserDto: string) {
        console.log(deleteUserDto);
        return this.userService.deleteUser();
    }

    @Post("login")
    login(@Body() loginDto: string) {
        console.log(loginDto);
        return this.userService.login();
    }
}
