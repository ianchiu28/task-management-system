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
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";

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

@ApiTags("Users")
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: "Create a new user" })
    @ApiResponse({
        status: 200,
        description: "User created successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Success",
                },
                data: {
                    type: "object",
                    example: {},
                },
            },
        },
    })
    @Post()
    @HttpCode(HttpStatus.OK)
    async createUser(
        @Body() createUserReqDto: CreateUserReqDto,
    ): Promise<void> {
        await this.userService.createUser(createUserReqDto);
    }

    @ApiOperation({ summary: "Change user password" })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "Password changed successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Success",
                },
                data: {
                    type: "object",
                    example: {},
                },
            },
        },
    })
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

    @ApiOperation({ summary: "Delete user account" })
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: "User deleted successfully",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Success",
                },
                data: {
                    type: "object",
                    example: {},
                },
            },
        },
    })
    @Post("delete")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async deleteUser(
        @Request() req: { user: IRequestUser },
        @Body() deleteUserDto: DeleteUserReqDto,
    ) {
        const { email } = req.user;
        await this.userService.deleteUser(email, deleteUserDto);
    }

    @ApiOperation({ summary: "User login" })
    @ApiResponse({
        status: 200,
        description: "Login successful",
        schema: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    example: "Success",
                },
                data: {
                    type: "object",
                    properties: {
                        accessToken: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        },
                    },
                },
            },
        },
    })
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginReqDto: LoginReqDto): Promise<LoginResDto> {
        const accessToken = await this.userService.login(loginReqDto);
        return { accessToken };
    }
}
