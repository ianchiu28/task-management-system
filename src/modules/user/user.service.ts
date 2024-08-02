import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto";
import { uuid } from "src/common/types/type";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<uuid> {
        console.log(createUserDto);
        const user = this.userRepository.create({
            ...createUserDto,
            salt: "salt",
        });
        console.log(user);
        const result = await this.userRepository.save(user);
        console.log(result);
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
