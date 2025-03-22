import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/entities/repositories/property_repository.interface";
import { User } from "../../domain/entities/user";

export class FakePropertyRepository implements PropertyRepository {
  private properties: Property[] = [
    new Property("1", "Casa", "Casa de praia", 10, 450),
    new Property("2", "Casa", "Casa de montanha", 3, 550),
  ];

  async findById(id: string): Promise<Property | null> {
    return this.properties.find((user) => user.getId() === id) || null;
  }

  async save(property: Property) {
    this.properties.push(property);
  }
}
