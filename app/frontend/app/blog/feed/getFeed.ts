import { getAppConfig } from "@sside-net/app-config";
import { Feed } from "feed";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { apiClient } from "../../../library/api-client/api-client";
import { createLogger } from "../../../library/logger/createLogger";
import { captureApiCallError } from "../../../library/sentry/captureApiCallError";

const logger = createLogger("getBlogFeed");

/**
 * 直近のBlogEntryのフィード取得を行います。
 */
export const getFeed = async (): Promise<Feed> => {
    const {
        global: {
            appName,
            author,
            baseUrl: { frontend: baseUrl },
        },
        frontend: {
            blog: {
                feed: { recentFeedEntryCount, description, copyright },
            },
        },
    } = getAppConfig();

    logger.log("フィードの取得を行います。", {
        recentFeedEntryCount,
    });

    const feed = new Feed({
        title: appName,
        description,
        id: baseUrl,
        link: baseUrl,
        // optional, used only in RSS 2.0, possible values: https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        language: "ja",
        favicon: `${baseUrl}/icon.svg`,
        copyright,
        feedLinks: {
            rss: `${baseUrl}/feed/rss`,
            json: `${baseUrl}/feed/json`,
            atom: `${baseUrl}/feed/atom`,
        },
        author: {
            name: author,
        },
    });

    const { data, error, response } = await apiClient.GET(
        "/blog-entry/latest",
        {
            params: {
                query: {
                    count: recentFeedEntryCount,
                },
            },
        },
    );

    if (error) {
        await captureApiCallError(response, getFeed);

        throw error;
    }

    for (const { slug, title, bodyMarkdown, updatedAt, publishAt } of data) {
        const url = `${baseUrl}/blog/entry/${slug}`;

        // FIXME: BlogEntryの表示とパースを共通化することを検討
        const content = String(
            await unified()
                .use(remarkParse)
                .use(remarkGfm, {
                    singleTilde: false,
                })
                .use(remarkRehype)
                .use(rehypeRaw)
                .use(rehypeStringify)
                .process(bodyMarkdown),
        );

        feed.addItem({
            id: url,
            title,
            content,
            link: url,
            date: new Date(
                updatedAt && updatedAt > publishAt ? updatedAt : publishAt,
            ),
            author: [
                {
                    name: author,
                },
            ],
            copyright,
        });
    }

    return feed;
};
