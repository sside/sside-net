import { Test, TestingModule } from "@nestjs/testing";
import { DatabaseService } from "./database.service";
import { prepareTestDatabase } from "../library/test/database/prepareTestDatabase";

describe("DatabaseService", () => {
    let databaseService: DatabaseService;

    beforeEach(async () => {
        prepareTestDatabase();
        const module: TestingModule = await Test.createTestingModule({
            providers: [DatabaseService],
        }).compile();

        databaseService = module.get<DatabaseService>(DatabaseService);
    });

    test("DBに接続できること", async () => {
        const result =
            (await databaseService.$queryRaw`SELECT 1 as connect;`) as {
                connect: number;
            };
        expect(result.connect).toBe(1);
    });

    test("", async () => {});
});
