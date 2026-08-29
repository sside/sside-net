import type { Metadata } from "next";
import { getAppConfig } from "@sside-net/app-config";
import { ChildrenProp } from "../type/ChildrenProp";
import "./globals.css";

export const metadata: Metadata = {
    title: getAppConfig().global.appName,
};

export default async function RootLayout({ children }: ChildrenProp) {
    return (
        <html lang="ja">
            <body className="bg-background-body text-text-body min-h-dvh w-full max-w-dvw text-base font-normal">
                {children}
            </body>
        </html>
    );
}
