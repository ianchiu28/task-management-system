import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", nullable: false, unique: true })
    email: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    username: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    password: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    salt: string;

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
