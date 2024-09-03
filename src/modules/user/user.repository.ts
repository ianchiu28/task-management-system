import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "./user.entity";

export class UserRepository extends Repository<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {
        super(
            userRepository.target,
            userRepository.manager,
            userRepository.queryRunner,
        );
    }

    async isExist(email: string): Promise<boolean> {
        return this.userRepository.exists({ where: { email } });
    }

    async saveWithDuplicatedHandler(
        user: UserEntity,
        customError: Error,
    ): Promise<void> {
        try {
            await this.userRepository.save(user);
        } catch (error) {
            if (error.message.includes("duplicate key")) {
                throw customError;
            }

            throw error;
        }
    }

    async getPasswordInfo(email: string): Promise<UserEntity> {
        return this.userRepository.findOne({
            select: {
                salt: true,
                password: true,
            },
            where: { email },
        });
    }

    async updatePassword(
        email: string,
        newHashedPassword: string,
        newSalt: string,
    ): Promise<void> {
        await this.userRepository.update(
            { email },
            { password: newHashedPassword, salt: newSalt },
        );
    }
}
