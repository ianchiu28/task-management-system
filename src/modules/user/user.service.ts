import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto";
import { uuid } from "src/common/types/type";
// import { User } from "./user.entity";

@Injectable()
export class UserService {
    private users: string[] = [];

    createUser(createUserDto: CreateUserDto): uuid {
        console.log(createUserDto);
        return "sdasd-a-a-a-a";
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
