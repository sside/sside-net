import { FC } from "react";
import {
    validateBlogEntrySlug,
    validateBlogEntryTitle,
} from "@sside-net/validator";
import { validateBlogEntryMetaTags } from "@sside-net/validator/src";
import { DateTime } from "luxon";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../component/button/Button";
import { ManagementBlogEntryMetaTagInputSet } from "../_component/input/ManagementBlogEntryMetaTagInputSet";
import { ManagementDateTimeInputSet } from "../_component/input/ManagementDateTimeInputSet";
import { ManagementTextInputSet } from "../_component/input/ManagementTextInputSet";
import { ManagementBlogEntryBodyMarkdownEditor } from "./ManagementBlogEntryBodyMarkdownEditor";

export type BlogEntryFormInput = {
    title: string;
    slug: string;
    metaTagNames: string[];
    bodyMarkdown: string;
    publishAtIsoDateTimeLocal: string;
};

export const ManagementEditBlogEntryForm: FC<{
    onSubmitPublish: (formValue: BlogEntryFormInput) => Promise<unknown>;
    onSubmitSaveDraft: (formValue: BlogEntryFormInput) => Promise<unknown>;
    initialInput?: BlogEntryFormInput;
}> = ({ onSubmitPublish, onSubmitSaveDraft, initialInput }) => {
    const { register, setValue, formState, getValues, handleSubmit, control } =
        useForm<BlogEntryFormInput>({
            defaultValues: initialInput ?? {
                title: "",
                slug: "",
                bodyMarkdown: "",
                metaTagNames: [],
                publishAtIsoDateTimeLocal: "",
            },
        });

    return (
        <form
            className="management-edit-blog-entry-form grid gap-6"
            onSubmit={handleSubmit(async (data) => await onSubmitPublish(data))}
        >
            <ManagementTextInputSet
                label="Title"
                {...register("title", {
                    validate: (value) => validateBlogEntryTitle(value),
                })}
            />
            <ManagementTextInputSet
                label="Slug"
                {...register("slug", {
                    validate: (value) => validateBlogEntrySlug(value),
                })}
            />
            <Controller
                name="metaTagNames"
                rules={{
                    validate: (values) => validateBlogEntryMetaTags(values),
                }}
                render={({}) => (
                    <ManagementBlogEntryMetaTagInputSet
                        initialValue={initialInput?.metaTagNames}
                        onChange={(metaTagNames) =>
                            setValue("metaTagNames", metaTagNames, {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                        }
                    />
                )}
                control={control}
            />

            <ManagementDateTimeInputSet
                label="Publish at"
                {...register("publishAtIsoDateTimeLocal", {
                    validate: (value) =>
                        DateTime.fromISO(value).isValid ||
                        "ISO8601フォーマットで入力してください。",
                })}
            />
            <Controller
                name="bodyMarkdown"
                rules={{
                    required: true,
                }}
                render={({ field }) => (
                    <ManagementBlogEntryBodyMarkdownEditor
                        initialValue={field.value}
                        onUpdate={(blogEntryBodyMarkdown) =>
                            setValue("bodyMarkdown", blogEntryBodyMarkdown, {
                                shouldValidate: true,
                                shouldDirty: true,
                                shouldTouch: true,
                            })
                        }
                    />
                )}
                control={control}
            />

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    onClick={async () => await onSubmitSaveDraft(getValues())}
                    variant="primaryBordered"
                >
                    Save Draft
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={!formState.isValid}
                >
                    Publish
                </Button>
            </div>
        </form>
    );
};
