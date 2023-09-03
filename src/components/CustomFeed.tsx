import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";

export default async function CustomFeed() {
    const session = await getAuthSession();

    let followedCommunitiesIds: string[] = [];

    if (session) {
        followedCommunitiesIds = (
            await db.subscription.findMany({
                where: {
                    userId: session.user.id,
                },
                select: {
                    subredditId: true,
                },
            })
        ).map(({ subredditId }) => subredditId);
    }

    let whereClause = {};
    if (followedCommunitiesIds.length != 0) {
        whereClause = {
            subreddit: {
                id: {
                    in: followedCommunitiesIds,
                },
            },
        };
    }

    const posts = await db.post.findMany({
        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            subreddit: true,
            votes: true,
            author: true,
            comments: true,
        },
        where: whereClause,
    });

    return <PostFeed initialPosts={posts} />;
}
