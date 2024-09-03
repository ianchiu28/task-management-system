import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";

import { UserEntity } from "../user/user.entity";

@Entity({ name: "tasks" })
export class TaskEntity {
    @PrimaryGeneratedColumn("uuid")
    uuid: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({
        type: "enum",
        enum: ["pending", "in_progress", "completed"],
        default: "pending",
    })
    status: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp",
        default: () => "NOW()",
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamp",
        default: () => "NOW()",
    })
    updatedAt: Date;
}
