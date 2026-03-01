import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { components } from "../../generated/backend-schema";
import { mockGetBackendRequest } from "../../library/test/mockGetBackendRequest";

export const mockValuePublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag =
    [
        {
            id: 1,
            name: "foo",
            count: 1,
        },
        {
            id: 2,
            name: "bar",
            count: 2,
        },
        {
            id: 3,
            name: "baz",
            count: 20,
        },
    ] satisfies components["schemas"]["BlogEntryMetaTagCountResponse"][];

export const mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag =
    (msw: MswFixture) => {
        mockGetBackendRequest(
            "/public-blog-entry-meta-tag",
            mockValuePublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag,
            msw,
        );
    };
