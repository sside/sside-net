import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { mockPublicBlogEntryController_getBlogEntryArchiveYearMonths } from "../../../../test/mock/mockPublicBlogEntryController_getBlogEntryArchiveYearMonths";
import { mockPublicBlogEntryController_getLatestBlogEntries } from "../../../../test/mock/mockPublicBlogEntryController_getLatestBlogEntries";
import { mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag } from "../../../../test/mock/mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag";

export const mockBlogMenu = (mswFixture: MswFixture) => {
    mockPublicBlogEntryController_getLatestBlogEntries(mswFixture);
    mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag(
        mswFixture,
    );
    mockPublicBlogEntryController_getBlogEntryArchiveYearMonths(mswFixture);
};
