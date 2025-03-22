import { UserService } from "./user_service";
import { FakeUserRepository } from "../../infrastructure/repositories/fake_user_repository";
import { User } from "../../domain/entities/user";

describe("User Service", () => {
  let userService: UserService;
  let fakeUserRepository: FakeUserRepository;

  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    userService = new UserService(fakeUserRepository);
  });

  it("deve retornar null quando um ID inválido for passado", async () => {
    const user = await userService.findUserById("999");
    expect(user).toBeNull();
  });

  it("deve retornar um usuário quando um ID válido for passado", async () => {
    const user = await userService.findUserById("1");
    expect(user).not.toBeNull();
    expect(user?.getId()).toBe("1");
    expect(user?.getName()).toBe("John Doe");
  });

  it("deve salvar um usuário com sucesso", async () => {
    const user = new User("3", "Ada Lovelace");
    await userService.save(user);
    const result = userService.findUserById("3");

    expect(result).not.toBeNull();
    expect(user?.getName()).toBe("Ada Lovelace");
  });
});
