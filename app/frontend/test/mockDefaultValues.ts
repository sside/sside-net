import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { mockBlogMenu } from "../app/blog/_menu/test/mockBlogMenu";
import { mockBlogEntryController_getAllBlogEntries } from "./mock/mockBlogEntryController_getAllBlogEntries";
import { mockBlogEntryMetaTagController_getAllWithCount } from "./mock/mockBlogEntryMetaTagController_getAllWithCount";
import { mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Earlier } from "./mock/mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Earlier";
import { mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Later } from "./mock/mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Later";
import { mockPublicBlogEntryController_getBlogEntryArchiveByYear } from "./mock/mockPublicBlogEntryController_getBlogEntryArchiveByYear";
import { mockPublicBlogEntryController_getBlogEntryArchiveByYearMonth } from "./mock/mockPublicBlogEntryController_getBlogEntryArchiveByYearMonth";
import { mockPublicBlogEntryController_getBlogEntryArchiveYearMonths } from "./mock/mockPublicBlogEntryController_getBlogEntryArchiveYearMonths";
import { mockPublicBlogEntryController_getBlogEntryBySlug } from "./mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockPublicBlogEntryController_getLatestBlogEntries } from "./mock/mockPublicBlogEntryController_getLatestBlogEntries";
import { mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag } from "./mock/mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag";

export const mockDefaultValues = (mswFixture: MswFixture) => {
    mockBlogMenu(mswFixture);
    mockBlogEntryController_getAllBlogEntries(mswFixture);
    mockBlogEntryMetaTagController_getAllWithCount(mswFixture);
    mockPublicBlogEntryController_getBlogEntryBySlug(mswFixture);
    mockPublicBlogEntryController_getBlogEntryArchiveYearMonths(mswFixture);
    mockPublicBlogEntryController_getLatestBlogEntries(mswFixture);
    mockPublicBlogEntryMetaTagController_getAllPublishedBlogEntryMetaTag(
        mswFixture,
    );
    mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Later(
        mswFixture,
    );
    mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Earlier(
        mswFixture,
    );
    mockPublicBlogEntryController_getBlogEntryArchiveByYear(mswFixture);
    mockPublicBlogEntryController_getBlogEntryArchiveByYearMonth(mswFixture);
};
