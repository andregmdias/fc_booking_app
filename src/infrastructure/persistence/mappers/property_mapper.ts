import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

export class PropertyMapper {
  static fromEntity(entity: PropertyEntity): Property {
    return new Property(
      entity.getId(),
      entity.getName(),
      entity.getDescription(),
      entity.getMaxGuests(),
      Number(entity.getBasePricePerNight()),
    );
  }

  static fromModel(model: Property): PropertyEntity {
    return new PropertyEntity(
      model.getId(),
      model.getName(),
      model.getDescription(),
      model.getMaxGuests(),
      model.getBasePricePerNight(),
    );
  }
}
