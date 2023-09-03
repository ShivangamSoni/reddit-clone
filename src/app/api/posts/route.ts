import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
    const url = new URL(req.url);

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

    try {
        const { page, limit, subredditName } = z
            .object({
                limit: z.string(),
                page: z.string(),
                subredditName: z.string().nullish().optional(),
            })
            .parse({
                page: url.searchParams.get("page"),
                limit: url.searchParams.get("limit"),
                subredditName: url.searchParams.get("subredditName"),
            });

        let whereClause = {};

        if (subredditName) {
            whereClause = {
                subreddit: {
                    name: subredditName,
                },
            };
        } else if (session && followedCommunitiesIds.length != 0) {
            whereClause = {
                subreddit: {
                    id: {
                        in: followedCommunitiesIds,
                    },
                },
            };
        }

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
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

        return new Response(JSON.stringify(posts));
    } catch (err) {
        if (err instanceof z.ZodError) {
            return new Response("Invalid URL Params", { status: 422 });
        }

        return new Response("Error Fetching Posts, Please Try Again", {
            status: 500,
        });
    }
}
