import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FrontendCookieKey } from "../../constant/cookie/FrontendCookieKey";
import { ChildrenProp } from "../../type/ChildrenProp";
import { Providers } from "./Providers";

export default async function ManagementLayout({ children }: ChildrenProp) {
    const cookieStore = await cookies();
    if (!cookieStore.has(FrontendCookieKey.RefreshToken)) {
        return redirect(`/sign-in`);
    }

    return (
        <main className="h-full max-w-full p-12">
            <Providers>{children}</Providers>
        </main>
    );
}
