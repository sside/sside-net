import { ComponentProps, FC, Fragment } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import gitHubIconImage from "./image/github-mark-white.svg";

const FooterDescriptions: FC<{
    descriptions: {
        title: string;
        detail: string;
    }[];
}> = ({ descriptions }) => (
    <dl className="grid grid-cols-[max-content_1fr]">
        {descriptions.map(({ title, detail }) => (
            <Fragment key={title}>
                <dt className="after:content-[':']">{title}</dt>
                <dd className="ml-2">{detail}</dd>
            </Fragment>
        ))}
    </dl>
);

const FooterLinks: FC<{
    externalLinks: {
        image: StaticImport;
        siteDescription: string;
        url: string;
    }[];
}> = ({ externalLinks }) => (
    <div className="flex">
        {externalLinks.map(({ image, siteDescription, url }) => (
            <a
                href={url}
                key={url}
            >
                <Image
                    className="w-8"
                    src={image}
                    alt={siteDescription}
                />
            </a>
        ))}
    </div>
);

const DESCRIPTIONS = [
    {
        title: "author",
        detail: "sside",
    },
] satisfies ComponentProps<typeof FooterDescriptions>["descriptions"];

const EXTERNAL_LINKS = [
    {
        image: gitHubIconImage,
        siteDescription: "GitHub",
        url: "https://github.com/sside/sside-net",
    },
] satisfies ComponentProps<typeof FooterLinks>["externalLinks"];

export const BlogFooter: FC<{}> = ({}) => {
    return (
        <div className="layout-area-footer bg-background-menu px-menu grid w-full py-4">
            <FooterDescriptions descriptions={DESCRIPTIONS} />
            <FooterLinks externalLinks={EXTERNAL_LINKS} />
        </div>
    );
};
