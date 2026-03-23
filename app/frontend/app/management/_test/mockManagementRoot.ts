import { MswFixture } from "next/dist/experimental/testmode/playwright/msw";
import { mockBlogEntryController_getAllBlogEntries } from "../../../test/mock/mockBlogEntryController_getAllBlogEntries";
import { mockBlogEntryMetaTagController_getAllWithCount } from "../../../test/mock/mockBlogEntryMetaTagController_getAllWithCount";

export const mockManagementRoot = (mswFixture: MswFixture) => {
    mockBlogEntryController_getAllBlogEntries(mswFixture);
    mockBlogEntryMetaTagController_getAllWithCount(mswFixture);
};
