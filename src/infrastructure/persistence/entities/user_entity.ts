import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity("users")
export class UserEntity {
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    @PrimaryColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }
}