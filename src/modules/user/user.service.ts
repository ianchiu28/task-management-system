import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto";
import { User } from "./user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<void> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        const user = this.userRepository.create({
            ...createUserDto,
            salt,
            password: hashedPassword,
        });
        const result = await this.userRepository.save(user);
        console.log(result);
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
