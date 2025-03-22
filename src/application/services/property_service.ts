import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/entities/repositories/property_repository.interface";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async save(property: Property): Promise<void> {
    return this.propertyRepository.save(property);
  }
}
