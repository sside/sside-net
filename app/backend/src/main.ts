import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { getAppConfig } from "@sside-net/app-config";
import { EnvironmentType } from "@sside-net/constant";
import { updateOpenApiDocument } from "@sside-net/open-api/dist";
import { ProjectLogger } from "@sside-net/project-logger";
import { getEnvironmentType, parseDecimalInt } from "@sside-net/utility";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { JsonLogger } from "./library/logger/JsonLogger";

const logger = new ProjectLogger("NestJS bootstrap");

async function bootstrap() {
    const DEFAULT_LISTEN_PORT = 27_250;
    const listenPort = parseDecimalInt(process.env.PORT) || DEFAULT_LISTEN_PORT;

    const app = await NestFactory.create(AppModule, {
        logger: new JsonLogger(),
    });

    app.useGlobalPipes(new ValidationPipe());
    app.use(helmet());
    applyCors(app);
    if (getEnvironmentType() !== EnvironmentType.Production) {
        await serveSwaggerDocument(app, "swagger", listenPort);
    }

    logger.log("サーバを起動します。", {
        listenPort,
    });

    await app.listen(listenPort);
}

/**
 * Swagger UIのサーブとOpenAPIドキュメントの更新を行います。
 */
async function serveSwaggerDocument(
    app: INestApplication,
    documentPath: string,
    listenPort: number,
) {
    logger.log("Swaggerドキュメントをサーブします。", {
        url: `http://localhost:${listenPort}/${documentPath}`,
    });

    const openApiDocument = SwaggerModule.createDocument(
        app,
        new DocumentBuilder().setTitle(getAppConfig().global.appName).build(),
    );

    await updateOpenApiDocument(JSON.stringify(openApiDocument), true, true);

    SwaggerModule.setup(documentPath, app, openApiDocument);

    return;
}

/**
 * 環境別にCORS設定を行います。
 */
function applyCors(app: INestApplication): void {
    const allowedOrigin = getAppConfig().global.baseUrl.frontend;
    logger.log("CORSヘッダを設定します。", {
        allowedOrigin,
    });

    app.enableCors({
        origin: allowedOrigin,
        credentials: true,
    });

    return;
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
