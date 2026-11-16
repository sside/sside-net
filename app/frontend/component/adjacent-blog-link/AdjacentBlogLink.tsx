import { ComponentProps, FC } from "react";
import Link from "next/link";

export const AdjacentBlogLink: FC<
    { bodyText: string; headerText?: string } & Pick<
        ComponentProps<typeof Link>,
        "href"
    >
> = ({ bodyText, headerText, href }) => {
    return (
        <Link
            className={`adjacent-blog-link border-text-body text-text-body bg-base02 grid max-w-48 gap-1 rounded-md border px-4 py-2 text-pretty`}
            href={href}
        >
            {!!headerText && <span className={`font-bold`}>{headerText}</span>}
            <span>{bodyText}</span>
        </Link>
    );
};
