import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { getAppConfig } from "@sside-net/app-config";
import { ProjectLogger } from "@sside-net/project-logger";
import { parseDecimalInt } from "@sside-net/utility";
import helmet from "helmet";
import * as process from "node:process";
import { AppModule } from "./app.module";
import { JsonLogger } from "./library/logger/JsonLogger";

const logger = new ProjectLogger("NestJS bootstrap");

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new JsonLogger(),
    });

    applyValidationPipe(app);
    wearHelmet(app);
    serveSwaggerDocument(app);

    const listenPort = parseDecimalInt(process.env.PORT) || 3000;

    logger.log("サーバを起動します。", {
        listenPort,
    });

    await app.listen(process.env.PORT ?? 3000);
}

function applyValidationPipe(app: INestApplication) {
    logger.log("ValidationPipeをグローバルで有効にします。");

    return app.useGlobalPipes(new ValidationPipe());
}

function wearHelmet(app: INestApplication) {
    logger.log("appにHelmetを適用します。");

    return app.use(helmet());
}

function serveSwaggerDocument(app: INestApplication) {
    logger.log("Swaggerドキュメントをサーブします。");

    const documentBuilder = new DocumentBuilder()
        .setTitle(getAppConfig().global.appName)
        .build();

    SwaggerModule.setup("swagger", app, () =>
        SwaggerModule.createDocument(app, documentBuilder),
    );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
