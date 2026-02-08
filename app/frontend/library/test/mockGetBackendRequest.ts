import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { http } from "next/experimental/testmode/playwright/msw";
import { getAppConfig } from "@sside-net/app-config";
import { paths } from "../../generated/backend-schema";

export const mockGetBackendRequest = <T extends keyof paths>(
    path: T,
    mockValue: paths[T] extends (
        {
            get: {
                responses: {
                    200: {
                        content: {
                            "application/json": infer U;
                        };
                    };
                };
            };
        }
    ) ?
        U
    :   never,
    msw: MswFixture,
) => {
    msw.use(
        http.get(getAppConfig().frontend.backend.baseUrl + path, () =>
            Response.json(mockValue),
        ),
    );
};
