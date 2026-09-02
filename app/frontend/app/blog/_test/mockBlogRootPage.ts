import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Earlier } from "../../../test/mock/mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Earlier";
import { mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Later } from "../../../test/mock/mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Later";
import { mockPublicBlogEntryController_getBlogEntryBySlug } from "../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockBlogMenu } from "../_menu/test/mockBlogMenu";

export const mockBlogRootPage = (mswFixture: MswFixture) => {
    mockBlogMenu(mswFixture);
    mockPublicBlogEntryController_getBlogEntryBySlug(mswFixture);
    mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Earlier(
        mswFixture,
    );
    mockPublicBlogEntryController_getAdjacentLatestBlogEntries_Later(
        mswFixture,
    );
};
