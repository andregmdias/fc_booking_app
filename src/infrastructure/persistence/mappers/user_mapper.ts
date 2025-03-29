import {UserEntity} from "../entities/user_entity";
import {User} from "../../../domain/entities/user";

export class UserMapper {
    static fromEntity(entity: UserEntity): User {
        return new User(entity.getId(), entity.getName());
    }

    static fromModel(user: User): UserEntity {
        return new UserEntity(user.getId(), user.getName())
    }
}