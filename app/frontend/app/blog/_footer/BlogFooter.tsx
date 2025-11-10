import { FC, Fragment } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import gitHubIconImage from "./image/github-mark-white.svg";

const DESCRIPTIONS = [
    {
        title: "author",
        detail: "sside",
    },
] satisfies {
    title: string;
    detail: string;
}[];

const FooterDescriptions: FC<{}> = ({}) => (
    <dl>
        {DESCRIPTIONS.map(({ title, detail }) => (
            <Fragment key={title}>
                <dt className="after:content-[':']">{title}</dt>
                <dd>{detail}</dd>
            </Fragment>
        ))}
    </dl>
);

const EXTERNAL_LINKS = [
    {
        image: gitHubIconImage,
        siteDescription: "GitHub",
        url: "https://github.com/sside/sside-net",
    },
] satisfies {
    image: StaticImport;
    siteDescription: string;
    url: string;
}[];

const FooterLinks: FC = () => (
    <div className="grid">
        {EXTERNAL_LINKS.map(({ image, siteDescription, url }) => (
            <a
                href={url}
                key={url}
            >
                <Image
                    src={image}
                    alt={siteDescription}
                />
            </a>
        ))}
    </div>
);

export const BlogFooter: FC<{}> = ({}) => {
    return (
        <div className="layout-area-footer bg-background-menu grid w-full grid-cols-1">
            <FooterDescriptions />
            <FooterLinks />
        </div>
    );
};
