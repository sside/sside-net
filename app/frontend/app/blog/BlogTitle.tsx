import { FC } from "react";
import { getAppConfig } from "@sside-net/app-config";

export const BlogTitle: FC<{}> = ({}) => {
    return (
        <div className="bg-background-menu layout-area-header h-12 w-full text-center">
            <h1 className="font-mono text-4xl">
                {getAppConfig().global.appName}
            </h1>
        </div>
    );
};
