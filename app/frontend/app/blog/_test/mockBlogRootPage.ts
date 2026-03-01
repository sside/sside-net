import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { mockPublicBlogEntryController_getBlogEntryBySlug } from "../../../test/mock/mockPublicBlogEntryController_getBlogEntryBySlug";
import { mockBlogMenu } from "../_menu/test/mockBlogMenu";

export const mockBlogRootPage = (msw: MswFixture) => {
    mockBlogMenu(msw);
    mockPublicBlogEntryController_getBlogEntryBySlug(msw);
};
