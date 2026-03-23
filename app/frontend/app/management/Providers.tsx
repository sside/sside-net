"use client";

import { FC } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChildrenProp } from "../../type/ChildrenProp";

export const Providers: FC<ChildrenProp> = ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>
        {children}
    </QueryClientProvider>
);
