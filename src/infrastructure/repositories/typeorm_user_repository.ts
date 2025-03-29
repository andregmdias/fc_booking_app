import {UserRepository} from "../../domain/entities/repositories/user_repository.interface";
import {UserEntity} from "../persistence/entities/user_entity";
import {Repository} from "typeorm";
import {User} from "../../domain/entities/user";
import {UserMapper} from "../persistence/mappers/user_mapper";

export class TypeORMUserRepository implements UserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor(repository: Repository<UserEntity>) {
        this.repository = repository;
    }

    async save(user: User): Promise<void> {
        const userEntity = UserMapper.fromModel(user);
        await this.repository.save(userEntity);
    }

    async findById(id: string): Promise<User | null> {
        const userEntity: UserEntity | null = await this.repository.findOne({ where: { id } });
        return userEntity ? UserMapper.fromEntity(userEntity) : null;
    }
}