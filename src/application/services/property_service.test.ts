import { Property } from "../../domain/entities/property";
import { PropertyService } from "./property_service";
import { FakePropertyRepository } from "../../infrastructure/repositories/fake_property_repository";

describe("Property Service", () => {
  let propertyService: PropertyService;
  let fakePropertyRepository: FakePropertyRepository;

  beforeEach(() => {
    fakePropertyRepository = new FakePropertyRepository();
    propertyService = new PropertyService(fakePropertyRepository);
  });
  it("deve retornar null quando um ID inválido for passado", async () => {
    const property = await propertyService.findById("999");
    expect(property).toBeNull();
  });

  it("deve retornar um usuário quando um ID válido for passado", async () => {
    const property = await propertyService.findById("1");

    expect(property).not.toBeNull();
    expect(property?.getName()).toBe("Casa");
    expect(property?.getDescription()).toBe("Casa de praia");
    expect(property?.getMaxGuests()).toBe(10);
    expect(property?.getBasePricePerNight()).toBe(450);
  });

  it("deve salvar um usuário com sucesso", async () => {
    const property = new Property("3", "Casa", "Casa de campo", 8, 350);
    await propertyService.save(property);
    const result = propertyService.findById("1");

    expect(result).not.toBeNull();
    expect(property?.getName()).toBe("Casa");
    expect(property?.getDescription()).toBe("Casa de campo");
    expect(property?.getMaxGuests()).toBe(8);
    expect(property?.getBasePricePerNight()).toBe(350);
  });
});
