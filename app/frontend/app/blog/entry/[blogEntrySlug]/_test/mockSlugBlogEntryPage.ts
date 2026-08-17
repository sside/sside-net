import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { mockPublicBlogEntryController_getBlogEntryBySlug } from "../../../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockPublicBlogEntryController_getEarlier } from "../../../../../test/mock/mockPublicBlogEntryController_getEarlier";
import { mockPublicBlogEntryController_getLater } from "../../../../../test/mock/mockPublicBlogEntryController_getLater";
import { mockBlogMenu } from "../../../_menu/test/mockBlogMenu";

export const mockSlugBlogEntryPage = (mswFixture: MswFixture) => {
    mockBlogMenu(mswFixture);
    mockPublicBlogEntryController_getBlogEntryBySlug(mswFixture);
    mockPublicBlogEntryController_getLater(mswFixture);
    mockPublicBlogEntryController_getEarlier(mswFixture);
};
