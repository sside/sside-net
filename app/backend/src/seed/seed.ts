import { faker } from "@faker-js/faker";
import { NestFactory } from "@nestjs/core";
import { ProjectLogger } from "@sside-net/project-logger";
import { BlogEntryService } from "../blog-entry/blog-entry.service";
import { SeedModule } from "./seed.module";

const logger = new ProjectLogger("Seed");

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const app = await NestFactory.createApplicationContext(SeedModule, {
        logger: logger,
    });

    const blogEntryService = app.get(BlogEntryService);

    try {
        faker.seed(0);
        await blogEntryService.seed(10, 3, 5);

        return;
    } catch (e) {
        logger.error("Seedingに失敗しました。", e as Error);
    } finally {
        await app.close();
    }
})();
