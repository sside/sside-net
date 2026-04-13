import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { mockBlogEntryController_getAllBlogEntries } from "./mock/mockBlogEntryController_getAllBlogEntries";
import { mockBlogEntryMetaTagController_getAllWithCount } from "./mock/mockBlogEntryMetaTagController_getAllWithCount";
import { mockPublicBlogEntryController_getBlogEntryArchiveYearMonths } from "./mock/mockPublicBlogEntryController_getBlogEntryArchiveYearMonths";
import { mockPublicBlogEntryController_getBlogEntryBySlug } from "./mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockPublicBlogEntryController_getLatestBlogEntries } from "./mock/mockPublicBlogEntryController_getLatestBlogEntries";
import { mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag } from "./mock/mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag";

export const mockDefaultValues = (mswFixture: MswFixture) => {
    mockBlogEntryController_getAllBlogEntries(mswFixture);
    mockBlogEntryMetaTagController_getAllWithCount(mswFixture);
    mockPublicBlogEntryController_getBlogEntryBySlug(mswFixture);
    mockPublicBlogEntryController_getBlogEntryArchiveYearMonths(mswFixture);
    mockPublicBlogEntryController_getLatestBlogEntries(mswFixture);
    mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag(
        mswFixture,
    );
};
