import { FC } from "react";
import Link from "next/link";
import { getAppConfig } from "@sside-net/app-config";

export const BlogTitle: FC<{}> = ({}) => {
    return (
        <div className="bg-background-menu layout-area-header text-base02 desktop:pl-2 max-desktop:text-center w-full py-8">
            <Link href="/blog">
                <h1 className="font-mono text-4xl">
                    {getAppConfig().global.appName}
                </h1>
            </Link>
        </div>
    );
};
