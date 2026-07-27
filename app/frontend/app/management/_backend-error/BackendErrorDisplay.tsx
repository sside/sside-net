import { FC } from "react";
import { ApiClientErrorResponse } from "../../../library/api-client/ApiClientErrorResponse";

export const BackendErrorDisplay: FC<{
    errorMessage: string;
    errorResponse: ApiClientErrorResponse;
}> = ({ errorMessage, errorResponse }) => {
    return (
        <div className="backend-error-display w-full">
            <span className="text-lg font-bold">{errorMessage}</span>
            <pre>{JSON.stringify(errorResponse, undefined, 2)}</pre>
        </div>
    );
};
