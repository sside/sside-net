import { FC, ReactNode } from "react";
import { Nullish } from "utility-types";

export const AdjacentBlogLinksContainer: FC<{
    next: ReactNode | Nullish;
    previous: ReactNode | Nullish;
}> = ({ next, previous }) => {
    return (
        <div className="adjacent-blog-links-container flex w-full justify-between">
            {previous}
            <div className="ml-auto">{next}</div>
        </div>
    );
};
