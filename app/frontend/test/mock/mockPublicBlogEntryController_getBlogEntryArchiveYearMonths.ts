import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { components } from "../../generated/backend-schema";
import { mockGetBackendRequest } from "../../library/test/mockGetBackendRequest";

export const mockValuePublicBlogEntryController_getBlogEntryArchiveYearMonths =
    [
        {
            year: 2021,
            month: 6,
            count: 4,
        },
        {
            year: 2025,
            month: 7,
            count: 1,
        },
        {
            year: 2022,
            month: 2,
            count: 1,
        },
        {
            year: 2022,
            month: 4,
            count: 2,
        },
        {
            year: 2021,
            month: 4,
            count: 2,
        },
        {
            year: 2025,
            month: 2,
            count: 1,
        },
        {
            year: 2021,
            month: 10,
            count: 2,
        },
    ] satisfies components["schemas"]["BlogEntryArchivePublishDatesResponse"][];

export const mockPublicBlogEntryController_getBlogEntryArchiveYearMonths = (
    msw: MswFixture,
) => {
    mockGetBackendRequest(
        "/public-blog-entry/archive-year-month",
        mockValuePublicBlogEntryController_getBlogEntryArchiveYearMonths,
        msw,
    );
};
