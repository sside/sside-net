import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { fakerEN, fakerJA } from "@faker-js/faker";
import { MARKDOWN_SAMPLES } from "@sside-net/constant";
import { createIntegerRange } from "@sside-net/utility";
import { components } from "../../library/api-client/backend-schema";
import { mockBackendGetResponse } from "../mockBackendGetResponse";

export const mockValueBlogEntryController_getAllBlogEntries =
    createIntegerRange(0, 9).map(
        (id): components["schemas"]["BlogEntryResponse"] => {
            return {
                id,
                title: fakerJA.book.title(),
                metaTags: [{ id, name: fakerEN.lorem.slug(1) }],
                updatedAt: new Date().toISOString(),
                bodyMarkdown: MARKDOWN_SAMPLES.at(
                    id % MARKDOWN_SAMPLES.length,
                )!,
                createdAt: new Date().toISOString(),
                slug: fakerEN.lorem.slug(1),
                publishAt: id % 2 === 0 ? new Date().toISOString() : undefined,
            };
        },
    ) satisfies components["schemas"]["BlogEntryResponse"][];

export const mockBlogEntryController_getAllBlogEntries = (msw: MswFixture) => {
    mockBackendGetResponse(
        "/blog-entry",
        mockValueBlogEntryController_getAllBlogEntries,
        msw,
    );
};
