import { User } from "./user";

describe("User Entity", () => {
  it("deve criar uma instância de User com ID e Nome", () => {
    const user = new User("1", "João da Silva");

    expect(user.getId()).toBe("1");
    expect(user.getName()).toBe("João da Silva");
  });

  it("deve lançar um erro se o nome for vazio", () => {
    expect(() => new User("1", "")).toThrow("O nome é obrigatório");
  });

  it("deve lançar um erro se o id for vazio", () => {
    expect(() => new User("", "John")).toThrow("O id é obrigatório");
  });
});
