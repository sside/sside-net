import { FC, useEffect, useId } from "react";
import { Crepe } from "@milkdown/crepe";
import "@milkdown/crepe/theme/common/style.css";
import {
    Milkdown,
    MilkdownProvider,
    useEditor,
    useInstance,
} from "@milkdown/react";
import { ProjectLogger } from "@sside-net/project-logger";
import { ManagementInputSet } from "../_component/input/ManagementInputSet";
import "./MarkdownEditor.css";

const CrepeMarkdownEditor: FC<{
    initialValue: string;
    onUpdate: (value: string) => void;
}> = ({ initialValue, onUpdate }) => {
    const { get } = useEditor((container) => {
        const crepe = new Crepe({
            root: container,
            defaultValue: initialValue,
            features: {
                [Crepe.Feature.TopBar]: true,
                [Crepe.Feature.Toolbar]: true,
            },
        });

        crepe.on((api) => {
            api.markdownUpdated((_, markdown, prevMarkdown) => {
                if (markdown === prevMarkdown) {
                    return;
                }

                onUpdate(markdown);

                return;
            });
        });

        return crepe;
    });

    useEffect(() => {
        return () => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises -- destructorなのでawait不要
            get()?.destroy();
        };
    }, []);

    return (
        <div className="crepe-markdown-editor border-text-body border">
            <Milkdown />
        </div>
    );
};

const MilkdownControl: FC<{}> = ({}) => {
    const logger = new ProjectLogger(MilkdownControl.name);
    const [isLoading, getInstance] = useInstance();

    if (isLoading) {
        return;
    }

    logger.log("MilkdownControl status", {
        isLoading,
        milkdownInstance: !!getInstance(),
    });

    return <></>;
};

export const ManagementBlogEntryBodyMarkdownEditor: FC<{
    initialValue: string;
    onUpdate: (blogEntryBodyMarkdown: string) => void;
}> = ({ initialValue, onUpdate }) => {
    const id = useId();

    return (
        <div className="management-blog-entry-body-markdown-editor min-w-0">
            <MilkdownProvider>
                <ManagementInputSet
                    label="Body"
                    htmlFor={id}
                >
                    <CrepeMarkdownEditor
                        initialValue={initialValue}
                        onUpdate={onUpdate}
                    />
                    <MilkdownControl />
                </ManagementInputSet>
            </MilkdownProvider>
        </div>
    );
};
