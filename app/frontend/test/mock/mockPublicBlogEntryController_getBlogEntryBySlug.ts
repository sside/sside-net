import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { fakerEN } from "@faker-js/faker";
import { MARKDOWN_SAMPLE_GITHUB_FLAVORED_GIELLALT } from "@sside-net/constant";
import { components } from "../../generated/backend-schema";
import { mockGetBackendRequest } from "../../library/test/mockGetBackendRequest";

export const mockValuePublicBlogEntryController_getBlogEntryBySlug = {
    title: fakerEN.book.title(),
    id: 1,
    slug: "sample-slug",
    bodyMarkdown: MARKDOWN_SAMPLE_GITHUB_FLAVORED_GIELLALT,
    publishAt: "2026-02-23T13:55:19.540Z",
    metaTags: [],
    createdAt: "2026-02-23T13:55:19.540Z",
    updatedAt: "2026-02-25T03:55:19.540Z",
} satisfies components["schemas"]["BlogEntryResponse"];

export const mockPublicBlogEntryController_getBlogEntryBySlug = (
    mswFixture: MswFixture,
) => {
    mockGetBackendRequest(
        `/public-blog-entry/slug/${mockValuePublicBlogEntryController_getBlogEntryBySlug.slug}` as "/public-blog-entry/slug/{slug}",
        mockValuePublicBlogEntryController_getBlogEntryBySlug,
        mswFixture,
    );
};
