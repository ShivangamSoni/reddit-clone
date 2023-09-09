import CommentsSection from "@/components/CommentsSection";
import EditorOutput from "@/components/EditorOutput";
import PostVoteServer from "@/components/PostVote/Server";
import PostVoteShell from "@/components/PostVote/Shell";

import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { CachePost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function page({
    params: { postId },
}: {
    params: {
        postId: string;
    };
}) {
    const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachePost;

    let post: (Post & { votes: Vote[]; author: User }) | null = null;

    if (!cachedPost) {
        post = await db.post.findFirst({
            where: {
                id: postId,
            },
            include: {
                votes: true,
                author: true,
            },
        });
    }

    if (!post && !cachedPost) return notFound();

    return (
        <div>
            <div className="h-full flex flex-col sm:flex-row items-center sm:items-start justify-between">
                <Suspense fallback={<PostVoteShell />}>
                    {/* @ts-expect-error Async Server Component */}
                    <PostVoteServer
                        postId={post?.id ?? cachedPost.id}
                        getData={async () => {
                            return await db.post.findUnique({
                                where: {
                                    id: postId,
                                },
                                include: {
                                    votes: true,
                                },
                            });
                        }}
                    />
                </Suspense>

                <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
                    <div>
                        <p className="max-h-40 mt-1 truncate text-xs text-gray-500 divide-x space-x-2">
                            <span>
                                Posted by u/
                                {post?.author.username ??
                                    cachedPost.authorUserName}
                            </span>
                            <span className="inline-block pl-2">
                                {formatTimeToNow(
                                    new Date(
                                        post?.createdAt ?? cachedPost.createdAt
                                    )
                                )}
                            </span>
                        </p>
                        <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
                            {post?.title ?? cachedPost.title}
                        </h1>
                    </div>
                    <EditorOutput
                        content={post?.content ?? cachedPost.content}
                    />

                    <Suspense
                        fallback={
                            <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
                        }
                    >
                        {/* @ts-expect-error Server Component */}
                        <CommentsSection postId={post?.id ?? cachedPost.id} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
