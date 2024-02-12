import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication } from "@nestjs/common";
import { JsonLogger } from "../library/json-logger/JsonLogger";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { getApplicationConfig } from "@sside-net/app-config";
import { Environment } from "../library/environment/Environment";

const logger = new JsonLogger();

const environment = new Environment();
const applicationConfig = getApplicationConfig(environment.type);

const FALLBACK_LISTEN_PORT = 20100;
const listenPort = process.env.PORT ?? FALLBACK_LISTEN_PORT;

async function bootstrap(): Promise<void> {
    logger.log("バックエンドの起動を開始します。", {
        listenPort,
    });

    const { isDevelopment } = environment;
    const app = await NestFactory.create(AppModule, {
        snapshot: isDevelopment,
    });

    if (isDevelopment) {
        serveOpenApiDocument(app);
    }

    await app.listen(listenPort);
}

function serveOpenApiDocument(app: INestApplication): void {
    const API_DOCUMENT_ROUTE_NAME = "openapi";
    logger.log("OpenAPIドキュメントをホストします。");

    SwaggerModule.setup(
        "openapi",
        app,
        SwaggerModule.createDocument(
            app,
            new DocumentBuilder()
                .setTitle(`${applicationConfig.siteName} API document`)
                .build(),
        ),
    );

    logger.log("OpenAPI document URL", {
        url: `http://localhost:${listenPort}/${API_DOCUMENT_ROUTE_NAME}`,
    });

    return;
}

bootstrap();
