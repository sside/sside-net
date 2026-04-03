import { FC } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { AllowedInlineMarkdownTags } from "../../../constant/markdown/AllowedInlineMarkdownTags";
import "./BlogEntryBody.css";

export const BlogEntryBody: FC<{ bodyMarkdown: string }> = ({
    bodyMarkdown,
}) => {
    return (
        <div className="blog-entry-body text-pretty">
            <Markdown
                remarkPlugins={[
                    [
                        remarkGfm,
                        {
                            singleTilde: false,
                        },
                    ],
                ]}
                remarkRehypeOptions={{
                    allowDangerousHtml: true,
                }}
                rehypePlugins={[rehypeRaw]}
                components={{
                    h1: "h3",
                    h2: "h4",
                    h3: "h5",
                    h4: "h6",
                    h5: ({ node: _node, ...props }) => (
                        <h6
                            aria-level={7}
                            {...props}
                        />
                    ),
                    h6: ({ node: _node, ...props }) => (
                        <h6
                            aria-level={8}
                            {...props}
                        />
                    ),
                }}
                allowedElements={AllowedInlineMarkdownTags}
            >
                {bodyMarkdown}
            </Markdown>
        </div>
    );
};
