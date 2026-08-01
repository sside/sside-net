"use client";

import { FC } from "react";
import { getAppConfig } from "@sside-net/app-config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChildrenProp } from "../../type/ChildrenProp";

export const Providers: FC<ChildrenProp> = ({ children }) => (
    <QueryClientProvider
        client={
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: getAppConfig().frontend.apiClient
                            .onErrorRetryCount,
                    },
                },
            })
        }
    >
        {children}
    </QueryClientProvider>
);
