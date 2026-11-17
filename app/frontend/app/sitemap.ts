import { MetadataRoute } from "next";
import { connection } from "next/server";
import { getAppConfig } from "@sside-net/app-config";
import { apiClient } from "../library/api-client/api-client";
import { createLogger } from "../library/logger/createLogger";
import { captureApiCallError } from "../library/sentry/captureApiCallError";
import { formatMonthToTwoDigits } from "../library/utility/formatMonthToTwoDigits";

const logger = createLogger("sitemap");

const baseUrl = getAppConfig().global.baseUrl.frontend;

/**
 * Blogのルートを取得します。
 */
async function getBlogRoot(): Promise<MetadataRoute.Sitemap> {
    logger.log("直近の更新日を含むBlogルートを取得します。");

    const { data, error, response } = await apiClient.GET(
        "/blog-entry/latest",
        {
            params: {
                query: {
                    count: 1,
                },
            },
        },
    );

    if (error) {
        await captureApiCallError(response, getBlogRoot);

        return [];
    }
    const latest = data.at(0);
    if (!latest) {
        return [];
    }

    return [
        {
            url: `${baseUrl}/blog`,
            lastModified: latest.publishAt,
        },
    ];
}

/**
 * 個別BlogEntryの一覧を取得します。
 */
async function getAllBlogEntries(): Promise<MetadataRoute.Sitemap> {
    logger.log("slugでアクセスする全てのBlogEntryを取得します。");

    const { maximumFetchCountPerOnce } =
        getAppConfig().backend.blogEntry.public;
    const fetchRecursive = async (
        accumulator: MetadataRoute.Sitemap = [],
        pointerBlogEntrySlug?: string,
    ): Promise<MetadataRoute.Sitemap> => {
        const {
            data: blogEntries,
            error: blogEntriesError,
            response: blogEntriesResponse,
        } = await apiClient.GET("/blog-entry/latest", {
            params: {
                query: {
                    count: maximumFetchCountPerOnce,
                    "pointer-blog-entry-slug": pointerBlogEntrySlug,
                },
            },
        });

        if (blogEntriesError) {
            await captureApiCallError(blogEntriesResponse, getAllBlogEntries);

            return accumulator;
        }

        const appended = [
            ...accumulator,
            ...blogEntries.map(
                ({ slug, publishAt, updatedAt }): MetadataRoute.Sitemap[0] => ({
                    url: `${baseUrl}/blog/entry/${slug}`,
                    lastModified:
                        updatedAt && updatedAt > publishAt ?
                            updatedAt
                        :   publishAt,
                }),
            ),
        ];

        const last = blogEntries.at(-1);
        if (!last) {
            return appended;
        }

        const {
            data: earlierBlogEntry,
            error: earlierBlogEntryError,
            response: earlierBlogEntryResponse,
        } = await apiClient.GET("/blog-entry/latest/adjacent/{direction}", {
            params: {
                path: {
                    direction: "earlier",
                },
                query: {
                    "pointer-blog-entry-slug": last.slug,
                    count: maximumFetchCountPerOnce,
                },
            },
        });

        if (earlierBlogEntryError) {
            await captureApiCallError(
                earlierBlogEntryResponse,
                getAllBlogEntries,
            );

            return appended;
        }

        if (!earlierBlogEntry) {
            return appended;
        }

        return fetchRecursive(appended, last.slug);
    };

    return await fetchRecursive();
}

/**
 * BlogEntryのMetaTag一覧を取得します。
 */
async function getBlogEntryMetaTags(): Promise<MetadataRoute.Sitemap> {
    logger.log("BlogEntryのMetaTag一覧を取得します。");

    const { data, error, response } = await apiClient.GET(
        "/blog-entry-meta-tag",
    );

    if (error) {
        await captureApiCallError(response, getBlogEntryMetaTags);

        return [];
    }

    return data.map(({ name }) => ({
        url: `${baseUrl}/blog/meta-tag/${name}`,
    }));
}

/**
 * 年次、月次アーカイブ一覧を取得します。
 */
async function getArchives(): Promise<MetadataRoute.Sitemap> {
    logger.log("月次、年次アーカイブページ一覧を取得します。");

    const { data, error, response } = await apiClient.GET(
        "/blog-entry/archive-year-month",
    );

    if (error) {
        await captureApiCallError(response, getArchives);

        return [];
    }

    return [
        ...data.map(({ year }): MetadataRoute.Sitemap[0] => ({
            url: `${baseUrl}/blog/archive/${year}`,
        })),
        ...data.map(({ year, month }): MetadataRoute.Sitemap[0] => ({
            url: `${baseUrl}/blog/archive/${year}/${formatMonthToTwoDigits(month)}`,
        })),
    ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    await connection();

    return (
        await Promise.all([
            getBlogRoot(),
            getAllBlogEntries(),
            getBlogEntryMetaTags(),
            getArchives(),
        ])
    ).flat();
}
