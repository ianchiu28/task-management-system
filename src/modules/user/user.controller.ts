import { Controller, Post, Patch, Param, Body } from "@nestjs/common";
import { UserService } from "./user.service";
// import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(@Body() createUserDto: string) {
        console.log(createUserDto);
        return this.userService.createUser();
    }

    @Patch(":uuid")
    changePassword(@Body() changePasswordDto: string) {
        console.log(changePasswordDto);
        return this.userService.changePassword();
    }

    @Post(":uuid/delete-account")
    deleteUser(@Param("uuid") uuid: string, @Body() deleteUserDto: string) {
        console.log(deleteUserDto);
        return this.userService.deleteUser();
    }

    @Post("login")
    login(@Body() loginDto: string) {
        console.log(loginDto);
        return this.userService.login();
    }
}
