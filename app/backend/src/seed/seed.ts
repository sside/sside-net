import { fakerEN } from "@faker-js/faker";
import { NestFactory } from "@nestjs/core";
import { BlogEntryService } from "../blog-entry/blog-entry.service.js";
import { BackendLogger } from "../library/logger/BackendLogger.js";
import { SeedModule } from "./seed.module.js";

const logger = new BackendLogger("Seed");

// eslint-disable-next-line @typescript-eslint/no-floating-promises -- ブートストラップなので無視
(async () => {
    const app = await NestFactory.createApplicationContext(SeedModule, {
        logger: logger,
    });

    const blogEntryService = app.get(BlogEntryService);

    try {
        fakerEN.seed(0);
        await blogEntryService.seed(50, 3, 10);

        return;
    } catch (e) {
        logger.error("Seedingに失敗しました。", e as Error);
    } finally {
        await app.close();
    }
})();
