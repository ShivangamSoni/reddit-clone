"use client";

import { useIntersection } from "@mantine/hooks";

import { ExtendedPost } from "@/types/db";
import { useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatTimeToNow } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./PostVote/Client";

interface Props {
    initialPosts: ExtendedPost[];
    subredditName: string;
}

export default function PostFeed({ subredditName, initialPosts }: Props) {
    const lastPostRef = useRef<HTMLElement | null>(null);
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["infinite-feed", subredditName],
        async queryFn({ pageParam = 1 }) {
            const query =
                `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
                (!!subredditName ? `&subredditName=${subredditName}` : "");

            const { data } = await axios.get(query);
            return data as ExtendedPost[];
        },
        getNextPageParam(_, pages) {
            return pages.length + 1;
        },
        initialData: { pages: [initialPosts], pageParams: [1] },
    });

    const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

    return (
        <ul className="flex flex-col col-span-2 space-y-6">
            {posts.map((post, idx) => (
                <PostItem
                    key={post.id}
                    post={post}
                    ref={idx === posts.length - 1 ? ref : undefined}
                />
            ))}
        </ul>
    );
}

function PostItem({
    post,
    ref,
}: {
    post: ExtendedPost;
    ref?: (element: HTMLElement | null) => void;
}) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const { data: session } = useSession();

    const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "up") return acc + 1;
        if (vote.type === "down") return acc - 1;
        return acc;
    }, 0);

    const commentAmnt = post.comments.length;

    const currentVote = post.votes.find(
        (vote) => vote.userId === session?.user.id
    );

    return (
        <li ref={ref} className="rounded-md bg-white shadow">
            <div className="px-5 py-4 flex justify-between">
                <PostVoteClient
                    initialVotesAmt={votesAmt}
                    initialVote={currentVote?.type}
                    postId={post.id}
                />

                <div className="w-0 flex-1">
                    <div className="max-h-40 mt-1 text-xs text-gray-500 divide-x space-x-2">
                        <Link
                            href={`/r/${post.subreddit.name}`}
                            className="underline text-zinc-900 text-sm underline-offset-2"
                        >
                            r/{post.subreddit.name}
                        </Link>

                        <span className="inline-block pl-2">
                            Posted by u/{post.author.name}
                        </span>

                        <span className="inline-block pl-2">
                            Posted: {formatTimeToNow(post.createdAt)}
                        </span>
                    </div>

                    <Link href={`/r/${post.subreddit.name}/post/${post.id}`}>
                        <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
                            {post.title}
                        </h1>
                    </Link>

                    <div
                        className="relative text-sm max-h-40 w-full overflow-clip"
                        ref={contentRef}
                    >
                        <EditorOutput content={post.content} />
                        {contentRef.current?.clientHeight === 160 && (
                            <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white" />
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
                <Link
                    href={`/r/${post.subreddit.name}/post/${post.id}`}
                    className="w-fit flex items-center gap-2"
                >
                    <MessageSquare className="h-4 w-4" /> {commentAmnt} Comments
                </Link>
            </div>
        </li>
    );
}
