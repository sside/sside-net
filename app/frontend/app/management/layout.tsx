import { ChildrenProp } from "../../type/ChildrenProp";

export default async function ManagementLayout({ children }: ChildrenProp) {
    return (
        <main className="layout-mobile sm:layout-desktop min-h-dvh p-12">
            {children}
        </main>
    );
}
