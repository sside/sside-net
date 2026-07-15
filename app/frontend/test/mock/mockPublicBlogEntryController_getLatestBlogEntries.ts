import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { fakerEN, fakerJA } from "@faker-js/faker";
import { MARKDOWN_SAMPLE_OLD_BLOG_1 } from "@sside-net/constant";
import { createIntegerRange } from "@sside-net/utility";
import { components } from "../../generated/api-client/backend-schema";
import { mockBackendGetResponse } from "../mockBackendGetResponse";

export const mockValuePublicBlogEntryController_getLatestBlogEntries =
    createIntegerRange(1, 3)
        .map((id): components["schemas"]["PublishedBlogEntryResponse"] => ({
            id,
            bodyMarkdown: MARKDOWN_SAMPLE_OLD_BLOG_1,
            title: fakerJA.book.title(),
            slug: fakerEN.lorem.slug(1),
            publishAt: fakerEN.date.past().toISOString(),
            metaTags: [],
            createdAt: fakerEN.date.past().toISOString(),
            updatedAt: fakerEN.date.past().toISOString(),
        }))
        .toSorted(({ publishAt: aPublishAt }, { publishAt: bPublishAt }) =>
            bPublishAt < aPublishAt ? -1 : 1,
        ) satisfies components["schemas"]["PublishedBlogEntryResponse"][];

export const mockPublicBlogEntryController_getLatestBlogEntries = (
    msw: MswFixture,
) => {
    mockBackendGetResponse(
        "/blog-entry/latest",
        mockValuePublicBlogEntryController_getLatestBlogEntries,
        msw,
    );
};
