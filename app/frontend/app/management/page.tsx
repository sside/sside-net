import { ManagementBlogEntryList } from "./_blog-entry/ManagementBlogEntryList";

export default async function ManagementRootPage() {
    return (
        <div className="management-root-page grid gap-8">
            <ManagementBlogEntryList />
        </div>
    );
}
