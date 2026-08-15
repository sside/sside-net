import { ComponentProps, FC } from "react";
import Link from "next/link";
import { tv } from "tailwind-variants";
import { ChildrenProp } from "../../type/ChildrenProp";

export const AdjacentBlogLinkDirection = {
    Next: "next",
    Previous: "previous",
} as const;
export type AdjacentBlogEntryDirection =
    (typeof AdjacentBlogLinkDirection)[keyof typeof AdjacentBlogLinkDirection];

export const AdjacentBlogLink: FC<
    { direction?: AdjacentBlogEntryDirection } & Pick<
        ComponentProps<typeof Link>,
        "href"
    > &
        ChildrenProp
> = ({ direction, href, children }) => {
    const { Next, Previous } = AdjacentBlogLinkDirection;
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
            className={`adjacent-blog-link border-text-body text-text-body bg-base02 grid max-w-48 gap-1 rounded-md border px-4 py-2 text-pretty`}
            href={href}
        >
            {!!direction && (
                <span className={`font-bold ${directionStyle({ direction })}`}>
                    {direction}
                </span>
            )}
            {children}
        </Link>
    );
};
