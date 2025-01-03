import { NestFactory } from "@nestjs/core";
import { ProjectLogger } from "@sside-net/project-logger";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    await app.listen(process.env.PORT ?? 54298);
}

bootstrap().catch((error) => {
    new ProjectLogger("Nest").error("Unhandled error.", error);
});
