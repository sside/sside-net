import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { JsonLogger } from "./library/logger/JsonLogger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new JsonLogger(),
    });

    await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
