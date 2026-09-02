import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { fakerEN } from "@faker-js/faker";
import {
    MARKDOWN_SAMPLE_GITHUB_FLAVORED_GIELLALT,
    PagingDirection,
} from "@sside-net/constant";
import { createIntegerRange } from "@sside-net/utility";
import { components } from "../../generated/api-client/backend-schema";
import { mockBackendGetResponse } from "../mockBackendGetResponse";

export const mockValuePublicBlogEntryController_getAdjacentLatestBlogEntries_Later =
    {
        title: fakerEN.book.title(),
        id: 1,
        slug: "sample-slug",
        bodyMarkdown: MARKDOWN_SAMPLE_GITHUB_FLAVORED_GIELLALT,
        publishAt: "2026-02-23T13:55:19.540Z",
        metaTags: createIntegerRange(1, 10).map((value) => ({
            id: value,
            name: fakerEN.lorem.slug(1),
            count: fakerEN.number.int({
                min: 1,
                max: 100,
            }),
        })),
        createdAt: "2026-02-23T13:55:19.540Z",
        updatedAt: "2026-02-25T03:55:19.540Z",
    } satisfies components["schemas"]["PublishedBlogEntryResponse"];

export const mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Later =
    (mswFixture: MswFixture) => {
        mockBackendGetResponse(
            `/blog-entry/latest/adjecent/${PagingDirection.Later}` as "/blog-entry/latest/adjecent/{direction}",
            mockValuePublicBlogEntryController_getAdjacentLatestBlogEntries_Later,
            mswFixture,
        );
    };
