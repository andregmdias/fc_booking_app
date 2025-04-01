import { Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/entities/repositories/property_repository.interface";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { PropertyMapper } from "../persistence/mappers/property_mapper";

export class TypeORMPropertyRepository implements PropertyRepository {
  private readonly repository: Repository<PropertyEntity>;

  constructor(repository: Repository<PropertyEntity>) {
    this.repository = repository;
  }

  async save(property: Property): Promise<void> {
    const propertyEntity: PropertyEntity = PropertyMapper.fromModel(property);
    await this.repository.save(propertyEntity);
  }
  async findById(id: string): Promise<Property | null> {
    const propertyEntity: PropertyEntity | null = await this.repository.findOne(
      { where: { id } },
    );

    return propertyEntity ? PropertyMapper.fromEntity(propertyEntity) : null;
  }
}
