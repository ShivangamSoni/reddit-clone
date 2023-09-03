import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/votes";
import { CachePost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

        const { postId, voteType } = PostVoteValidator.parse(body);

        const session = await getAuthSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const userId = session.user.id;

        const existingVote = await db.vote.findFirst({
            where: {
                userId,
                postId,
            },
        });

        const post = await db.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                author: true,
                votes: true,
            },
        });

        if (!post) {
            return new Response("Post Not Found", { status: 404 });
        }

        if (existingVote) {
            if (existingVote.type === voteType) {
                await db.vote.delete({
                    where: {
                        userId_postId: {
                            userId,
                            postId,
                        },
                    },
                });
                return new Response("OK", { status: 200 });
            }

            await db.vote.update({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
                data: {
                    type: voteType,
                },
            });
        } else {
            await db.vote.create({
                data: {
                    type: voteType,
                    userId,
                    postId,
                },
            });
        }

        await redisCachePost({ post });
        return new Response("OK", { status: 200 });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return new Response("Invalid Data", { status: 422 });
        }

        return new Response("Could not register your vote, please try again", {
            status: 500,
        });
    }
}

async function redisCachePost({
    post,
}: {
    post: Post & {
        author: User;
        votes: Vote[];
    };
}) {
    // Recount the votes
    const votesAmt = post.votes.reduce((acc, vote) => {
        if (vote.type === "up") return acc + 1;
        if (vote.type === "down") return acc - 1;
        return acc;
    }, 0);

    // Caching in Redis, if votes go over a certain threshold
    if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const payload: CachePost = {
            authorUserName: post.author.username ?? "",
            id: post.id,
            title: post.title,
            content: JSON.stringify(post.content),
            createdAt: post.createdAt,
        };

        await redis.hset(`post:${post.id}`, payload);
    }
}
