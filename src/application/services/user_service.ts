import { UserRepository } from "../../domain/entities/repositories/user_repository.interface";
import { User } from "../../domain/entities/user";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async save(user: User): Promise<void> {
    return this.userRepository.save(user);
  }
}
