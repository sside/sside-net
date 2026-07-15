import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { components } from "../../../../generated/api-client/backend-schema";
import { ErrorResponse } from "../../../../library/api-client/ErrorResponse";
import { apiClient } from "../../../../library/api-client/api-client";
import { registerAuthenticationTokenCookie } from "../registerAuthenticationTokenCookie";

export async function POST(request: NextRequest): Promise<Response> {
    const { refreshToken } =
        (await request.json()) as components["schemas"]["TokenRefreshRequest"];

    const { data, error, response } = await apiClient.POST(
        "/authentication/refresh",
        {
            body: {
                refreshToken,
            },
        },
    );

    if (error) {
        return new NextResponse((error as ErrorResponse).message, {
            status: response.status,
        });
    }

    const { accessToken, refreshToken: receivedRefreshToken } = data!;
    await registerAuthenticationTokenCookie(accessToken, receivedRefreshToken);

    return new NextResponse(JSON.stringify(data), {
        status: StatusCodes.OK,
    });
}
