import { FC } from "react";
import Link from "next/link";
import { tv } from "tailwind-variants";

export const AdjacentBlogEntryDirection = {
    Next: "next",
    Previous: "previous",
} as const;
export type AdjacentBlogEntryDirection =
    (typeof AdjacentBlogEntryDirection)[keyof typeof AdjacentBlogEntryDirection];

export const AdjacentBlogEntryLink: FC<{
    direction: AdjacentBlogEntryDirection;
    slug: string;
    title: string;
}> = ({ direction, slug, title }) => {
    const { Next, Previous } = AdjacentBlogEntryDirection;
    const directionStyle = tv({
        variants: {
            direction: {
                [Next]: "justify-self-end after:content-['_>>>']",
                [Previous]: "before:content-['<<<_']",
            },
        },
    });

    return (
        <Link
            className={`adjacent-blog-entry-link border-text-body text-text-body bg-base02 grid max-w-48 gap-1 rounded-md border px-4 py-2 text-pretty`}
            href={`/blog/entry/${slug}`}
        >
            <span className={`font-bold ${directionStyle({ direction })}`}>
                {direction}
            </span>
            <span className="text-lg">{title}</span>
        </Link>
    );
};
