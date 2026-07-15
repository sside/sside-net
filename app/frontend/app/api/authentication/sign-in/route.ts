import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { components } from "../../../../generated/api-client/backend-schema";
import { ErrorResponse } from "../../../../library/api-client/ErrorResponse";
import { apiClient } from "../../../../library/api-client/api-client";
import { registerAuthenticationTokenCookie } from "../registerAuthenticationTokenCookie";

export async function POST(request: NextRequest): Promise<Response> {
    const { password } =
        (await request.json()) as components["schemas"]["SignInRequest"];

    const { data, error, response } = await apiClient.POST(
        "/authentication/sign-in",
        {
            body: {
                password,
            },
        },
    );

    if (error) {
        return new NextResponse((error as ErrorResponse).message, {
            status: response.status,
        });
    }

    const { accessToken, refreshToken } = data!;
    await registerAuthenticationTokenCookie(accessToken, refreshToken);

    return new NextResponse(JSON.stringify(data), {
        status: StatusCodes.OK,
    });
}
