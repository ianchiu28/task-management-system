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

    async isExistByEmail(email: string): Promise<boolean> {
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
}
