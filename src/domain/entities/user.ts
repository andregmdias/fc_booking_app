export class User {
  private readonly id: String;
  private readonly name: String;

  constructor(id: String, name: String) {
    if (!name) {
      throw new Error("O nome é obrigatório");
    }

    if (!id) {
      throw new Error("O id é obrigatório");
    }

    this.id = id;
    this.name = name;
  }

  getId(): String {
    return this.id;
  }

  getName(): String {
    return this.name;
  }
}
