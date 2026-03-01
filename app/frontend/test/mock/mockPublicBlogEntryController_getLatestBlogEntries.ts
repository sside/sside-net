import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { fakerEN, fakerJA } from "@faker-js/faker";
import { MARKDOWN_SAMPLE_GITHUB_FLAVORED_GIELLALT } from "@sside-net/constant";
import { createIntegerRange } from "@sside-net/utility";
import { components } from "../../generated/backend-schema";
import { mockGetBackendRequest } from "../../library/test/mockGetBackendRequest";

export const mockValuePublicBlogEntryController_getLatestBlogEntries = {
    blogEntries: createIntegerRange(1, 3)
        .map(
            (
                id,
            ): components["schemas"]["PublishedBlogEntriesResponse"]["blogEntries"][0] => ({
                id,
                bodyMarkdown: MARKDOWN_SAMPLE_GITHUB_FLAVORED_GIELLALT,
                title: fakerJA.book.title(),
                slug: fakerEN.lorem.slug(1),
                publishAt: fakerEN.date.past().toISOString(),
                metaTags: [],
                createdAt: fakerEN.date.past().toISOString(),
                updatedAt: fakerEN.date.past().toISOString(),
            }),
        )
        .toSorted(({ publishAt: aPublishAt }, { publishAt: bPublishAt }) =>
            bPublishAt < aPublishAt ? -1 : 1,
        ),
} satisfies components["schemas"]["PublishedBlogEntriesResponse"];

export const mockPublicBlogEntryController_getLatestBlogEntries = (
    msw: MswFixture,
) => {
    mockGetBackendRequest(
        "/public-blog-entry/latest",
        mockValuePublicBlogEntryController_getLatestBlogEntries,
        msw,
    );
};
