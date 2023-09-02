"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EditorJS from "@editorjs/editorjs";

import TextareaAutosize from "react-textarea-autosize";

import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

export default function Editor({ subredditId }: { subredditId: string }) {
    const pathname = usePathname();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostCreationRequest>({
        resolver: zodResolver(PostValidator),
        defaultValues: {
            subredditId,
            title: "",
            content: null,
        },
    });

    const editorRef = useRef<EditorJS | null>(null);
    const _titleRef = useRef<HTMLTextAreaElement | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const initializeEditor = useCallback(async () => {
        const EditorJs = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const Embed = (await import("@editorjs/embed")).default;
        const Table = (await import("@editorjs/table")).default;
        const List = (await import("@editorjs/list")).default;
        const Code = (await import("@editorjs/code")).default;
        const Link = (await import("@editorjs/link")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;
        const Image = (await import("@editorjs/image")).default;

        if (!editorRef.current) {
            const editor = new EditorJs({
                holder: "editor",
                onReady() {
                    editorRef.current = editor;
                },
                placeholder: "Type here to write your post...",
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: Link,
                        config: {
                            endpoint: "/api/link",
                        },
                    },
                    image: {
                        class: Image,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    const [res] = await uploadFiles(
                                        [file],
                                        "imageUploader"
                                    );

                                    return {
                                        success: 1,
                                        file: {
                                            url: res.fileUrl,
                                        },
                                    };
                                },
                            },
                        },
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                },
            });
        }
    }, []);

    useEffect(() => {
        if (typeof window != "undefined") {
            setIsMounted(true);
        }
    }, []);

    useEffect(() => {
        if (Object.keys(errors).length) {
            // eslint-disable-next-line no-unused-vars
            for (const [_, value] of Object.entries(errors)) {
                toast({
                    title: "Something went Wrong!",
                    description: (value as { message: string }).message,
                    variant: "destructive",
                });
            }
        }
    }, [errors]);

    useEffect(() => {
        if (isMounted) {
            (async () => {
                await initializeEditor();

                setTimeout(() => _titleRef.current?.focus());
            })();

            return () => {
                editorRef.current?.destroy();
                editorRef.current = null;
            };
        }
    }, [isMounted, initializeEditor]);

    const { ref: titleRef, ...titleProps } = register("title");

    const { mutateAsync: createPost } = useMutation({
        async mutationFn(payload: PostCreationRequest) {
            const { data } = await axios.post(
                "/api/subreddit/post/create",
                payload
            );
            return data;
        },
        onError() {
            return toast({
                title: "Something Went Wrong!!",
                description:
                    "Your post was not published, please try again later.",
                variant: "destructive",
            });
        },
        onSuccess() {
            const newPathname = pathname.split("/").slice(0, -1).join("/");
            router.push(newPathname);
            router.refresh();

            return toast({
                title: "Post Submitted",
                description: "Your Post has been Published",
            });
        },
    });

    async function onSubmit(data: PostCreationRequest) {
        const blocks = await editorRef.current?.save();

        const payload: PostCreationRequest = {
            title: data.title,
            subredditId,
            content: blocks,
        };
        createPost(payload);
    }

    if (!isMounted) return null;

    return (
        <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <form
                id="subreddit-post-form"
                className="w-full"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="prose prose-stone dark:prose-invert">
                    <TextareaAutosize
                        ref={(e) => {
                            _titleRef.current = e;
                            titleRef(e);
                        }}
                        {...titleProps}
                        placeholder="Title"
                        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
                    />
                    <div id="editor" />
                </div>
            </form>
        </div>
    );
}
