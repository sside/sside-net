import { FC } from "react";
import Link from "next/link";
import { tv } from "tailwind-variants";

const BlogMetaTagColorVariant = {
    BlogMenu: "blogMenu",
    BlogBody: "blogBody",
} as const;
type BlogMetaTagColorVariant =
    (typeof BlogMetaTagColorVariant)[keyof typeof BlogMetaTagColorVariant];

export const BlogMetaTag: FC<{
    name: string;
    blogEntryCount: number;
    variant: BlogMetaTagColorVariant;
}> = ({ name, blogEntryCount, variant }) => {
    const outerStyle = tv({
        base: "flex items-center gap-1 rounded-lg border p-1 pl-2",
        variants: {
            color: {
                [BlogMetaTagColorVariant.BlogMenu]:
                    "border-text-menu bg-background-menu text-text-menu",
                [BlogMetaTagColorVariant.BlogBody]:
                    "bg-base02 text-base0 border-base0",
            },
        },
    });
    const countStyle = tv({
        base: "flex h-4 w-4 items-center justify-center rounded-full border p-1 text-[10px]",
        variants: {
            color: {
                [BlogMetaTagColorVariant.BlogMenu]:
                    "bg-highlight-menu text-base2 border-highlight-menu",
                [BlogMetaTagColorVariant.BlogBody]: "bg-base0 text-base02",
            },
        },
    });

    return (
        <Link
            className={`blog-meta-tag ${outerStyle({
                color: variant,
            })}`}
            href={`/blog/meta-tag/${name}`}
        >
            <span>{name}</span>
            <span
                className={countStyle({
                    color: variant,
                })}
            >
                {blogEntryCount}
            </span>
        </Link>
    );
};
