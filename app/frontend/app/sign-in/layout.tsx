import { ChildrenProp } from "../../type/ChildrenProp";

export default async function SignInLayout({ children }: ChildrenProp) {
    return <main className="h-full max-w-full p-12">{children}</main>;
}
