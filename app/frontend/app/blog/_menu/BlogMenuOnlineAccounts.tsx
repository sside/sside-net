import { FC } from "react";
import { BlogMenuSection } from "./BlogMenuSection";

const ONLINE_ACCOUNTS = [
    {
        serviceName: "Twitter",
        accountName: "@sside",
        accountUrl: "https://x.com/sside",
    },
    {
        serviceName: "Steam",
        accountName: "sside",
        accountUrl: "https://steamcommunity.com/id/sside",
    },
    {
        serviceName: "Xbox Live",
        accountName: "sside net",
        accountUrl: "https://www.xbox.com/ja-JP/play/user/sside%20net",
    },
    {
        serviceName: "Nintendo Switch",
        accountName: "sside [Switch friend code: SW-7280-6189-9608]",
    },
    {
        serviceName: "PlayStation Network",
        accountName: "sside_net",
    },
] satisfies {
    serviceName: string;
    accountName: string;
    accountUrl?: string;
}[];

export const BlogMenuOnlineAccounts: FC<{}> = ({}) => {
    return (
        <BlogMenuSection headerLabel="Online accounts">
            <ul>
                {ONLINE_ACCOUNTS.map(
                    ({ accountName, serviceName, accountUrl }) => (
                        <li key={serviceName}>
                            {serviceName}:
                            {accountUrl ?
                                <a href={accountUrl}>{accountName}</a>
                            :   accountName}
                        </li>
                    ),
                )}
            </ul>
        </BlogMenuSection>
    );
};
