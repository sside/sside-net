import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { fakerEN, fakerJA } from "@faker-js/faker";
import { MARKDOWN_SAMPLE_OLD_BLOG_1 } from "@sside-net/constant";
import { createIntegerArray } from "@sside-net/utility";
import { components } from "../../generated/api-client/backend-schema";
import { mockBackendGetResponse } from "../mockBackendGetResponse";

export const mockValuePublicBlogEntryController_getBlogEntryArchiveByYearMonth =
    createIntegerArray(3)
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

export const mockPublicBlogEntryController_getBlogEntryArchiveByYearMonth = (
    mswFixture: MswFixture,
) => {
    mockBackendGetResponse(
        "/blog-entry/archive/:year/:month" as "/blog-entry/archive/{year}/{month}",
        mockValuePublicBlogEntryController_getBlogEntryArchiveByYearMonth,
        mswFixture,
    );
};
