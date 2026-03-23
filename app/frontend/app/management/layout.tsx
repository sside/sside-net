import { ChildrenProp } from "../../type/ChildrenProp";
import { Providers } from "./Providers";

export default async function ManagementLayout({ children }: ChildrenProp) {
    return (
        <main className="max-w-full p-12">
            <Providers>{children}</Providers>
        </main>
    );
}
