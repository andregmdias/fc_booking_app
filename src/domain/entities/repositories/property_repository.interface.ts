import { Property } from "../property";

export interface PropertyRepository {
  save(property: Property): Promise<void>;
  findById(id: string): Promise<Property | null>;
}
