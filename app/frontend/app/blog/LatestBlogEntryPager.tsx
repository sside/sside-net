import { FC } from "react";
import { PagingDirection } from "@sside-net/constant";
import { Client } from "openapi-fetch";
import { AdjacentBlogLinksContainer } from "../../component/adjacent-blog-link/AdjacentBlogLinksContainer";
import { paths } from "../../generated/api-client/backend-schema";
import { apiClient } from "../../library/api-client/api-client";
import { captureApiCallError } from "../../library/sentry/captureApiCallError";
import { NextLatestBlogEntryLink } from "./NextLatestBlogEntryLink";
import { PreviousLatestBlogEntryLink } from "./PreviousLatestBlogEntryLink";

export const LatestBlogEntryPager: FC<{
    count: number;
    pointerBlogEntrySlug: string | undefined;
}> = async ({ count, pointerBlogEntrySlug }) => {
    const {
        data: latestBlogEntries,
        response,
        error,
    } = await apiClient.GET("/blog-entry/latest", {
        params: {
            query: {
                count,
                "pointer-blog-entry-slug": pointerBlogEntrySlug,
            },
        },
    });

    if (error) {
        await captureApiCallError(response, LatestBlogEntryPager);

        return null;
    }

    const getPointerSlug = async ({
        data,
        error,
        response,
    }: Awaited<
        ReturnType<
            Client<paths["/blog-entry/latest/adjecent/{direction}"]>["GET"]
        >
    >): Promise<string | undefined> => {
        if (error) {
            await captureApiCallError(response, LatestBlogEntryPager);

            return undefined;
        }

        return data?.slug;
    };

    const previousPointerSlug = latestBlogEntries.at(0)?.slug;
    const nextPointerSlug = latestBlogEntries.at(-1)?.slug;
    const [previousSlug, nextSlug] = await Promise.all([
        previousPointerSlug ?
            getPointerSlug(
                await apiClient.GET("/blog-entry/latest/adjecent/{direction}", {
                    params: {
                        path: {
                            direction: PagingDirection.Later,
                        },
                        query: {
                            count: count,
                            "pointer-blog-entry-slug": previousPointerSlug,
                        },
                    },
                }),
            )
        :   undefined,
        nextPointerSlug ?
            getPointerSlug(
                await apiClient.GET("/blog-entry/latest/adjecent/{direction}", {
                    params: {
                        path: {
                            direction: PagingDirection.Earlier,
                        },
                        query: {
                            count: count,
                            "pointer-blog-entry-slug": nextPointerSlug,
                        },
                    },
                }),
            )
        :   undefined,
    ]);

    return (
        <div className="latest-blog-entry-pager">
            <AdjacentBlogLinksContainer
                next={
                    nextSlug && (
                        <NextLatestBlogEntryLink
                            pointerBlogEntrySlug={nextSlug}
                        />
                    )
                }
                previous={
                    previousSlug && (
                        <PreviousLatestBlogEntryLink
                            pointerBlogEntrySlug={previousSlug}
                        />
                    )
                }
            />
        </div>
    );
};
