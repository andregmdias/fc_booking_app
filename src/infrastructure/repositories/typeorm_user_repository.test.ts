import { DataSource, Repository } from "typeorm";
import { User } from "../../domain/entities/user";
import {UserEntity} from "../persistence/entities/user_entity";
import {TypeORMUserRepository} from "./typeorm_user_repository";
describe("TypeORMUserRepository", () => {
  let dataSource: DataSource;
  let userRepository: TypeORMUserRepository;
  let repository: Repository<UserEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [UserEntity],
      synchronize: true,
      logging: false,
    });

    await dataSource.initialize();
    repository = dataSource.getRepository(UserEntity);
    userRepository = new TypeORMUserRepository(repository);
  });

  afterAll(() => {
    dataSource.destroy();
  });

  it("deve salvar um usuário com sucesso", async () => {
    const user = new User("1", "John Doe");
    await userRepository.save(user);
    const fetchUser = await repository.findOne({ where: { id: "1" } });

    expect(fetchUser).not.toBe(null);
    expect(fetchUser?.id).toBe("1");
    expect(fetchUser?.name).toBe("John Doe");
  });

  it("deve encontrar o usuario com o id informado", async () => {
    const user = new User("1", "John Doe");
    await userRepository.save(user);

    const fetchedUser: User | null = await userRepository.findById("1");

    expect(fetchedUser).not.toBe(null);
    expect(fetchedUser?.getId()).toBe("1");
    expect(fetchedUser?.getName()).toBe("John Doe");
  })

  it("deve retornar null ao buscar um usuário inexsitente", async () => {
    const user = new User("1", "John Doe");
    await userRepository.save(user);
    const fetchedUser: User | null = await userRepository.findById("2");

    expect(fetchedUser).toBe(null);
  })
});
