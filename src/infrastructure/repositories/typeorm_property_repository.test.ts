import { DataSource, Repository } from "typeorm";
import { Property } from "../../domain/entities/property";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { TypeORMPropertyRepository } from "./typeorm_property_repository";

describe("TypeORMPropertyRepository", () => {
  let dataSource: DataSource;
  let propertyRepository: TypeORMPropertyRepository;
  let repository: Repository<PropertyEntity>;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [PropertyEntity],
      synchronize: true,
      logging: false,
    });

    await dataSource.initialize();
    repository = dataSource.getRepository(PropertyEntity);
    propertyRepository = new TypeORMPropertyRepository(repository);
  });

  afterAll(() => {
    dataSource.destroy();
  });

  it("deve salvar uma propriedade com sucesso", async () => {
    const property = new Property(
      "1",
      "Casa na praia",
      "Vista para o mar",
      6,
      200,
    );

    await propertyRepository.save(property);
    const fetchProperty = await repository.findOne({ where: { id: "1" } });
    expect(fetchProperty).not.toBeNull();
    expect(fetchProperty?.id).toBe("1");
  });

  it("deve retornar uma propriedade com ID válido", async () => {
    const property = new Property(
      "1",
      "Casa na praia",
      "Vista para o mar",
      6,
      200,
    );

    await propertyRepository.save(property);
    const fetchProperty = await propertyRepository.findById("1");
    expect(fetchProperty).not.toBeNull();
    expect(fetchProperty?.getId()).toBe("1");
  });

  it("deve retornar null quando não encontrar uma propriedade", async () => {
    const fetchProperty = await propertyRepository.findById("999999");
    expect(fetchProperty).toBeNull();
  });
});
