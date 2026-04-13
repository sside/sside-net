import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { fakerEN } from "@faker-js/faker";
import { createIntegerArray } from "@sside-net/utility";
import { components } from "../../library/api-client/backend-schema";
import { mockBackendGetResponse } from "../mockBackendGetResponse";

export const mockValueBlogEntryMetaTagController_getAllWithCount =
    createIntegerArray(10, 1).map((count) => ({
        id: count,
        name: fakerEN.lorem.slug(),
        count,
    })) satisfies components["schemas"]["BlogEntryMetaTagCountResponse"][];

export const mockBlogEntryMetaTagController_getAllWithCount = (
    mswFixture: MswFixture,
) => {
    mockBackendGetResponse(
        "/blog-entry-meta-tag",
        mockValueBlogEntryMetaTagController_getAllWithCount,
        mswFixture,
    );
};
