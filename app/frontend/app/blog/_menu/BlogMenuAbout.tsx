import { FC } from "react";
import { BlogMenuSection } from "./BlogMenuSection";

export const BlogMenuAbout: FC<{}> = ({}) => {
    return (
        <BlogMenuSection headerLabel="About this site">
            <p>長い文章載せたい時があるので作りました。</p>
            <p>
                コメント欄は用意しないので、誤りの指摘やご意見があればTwitterまでどうぞ。
            </p>
        </BlogMenuSection>
    );
};
