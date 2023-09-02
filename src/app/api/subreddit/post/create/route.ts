import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";

import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        const { subredditId, title, content } = PostValidator.parse(body);

        const isSubscribed = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id,
            },
        });

        if (!isSubscribed) {
            return new Response("Subscribe to the SubReddit in order to Post", {
                status: 400,
            });
        }

        await db.post.create({
            data: {
                subredditId,
                title,
                content,
                authorId: session.user.id,
            },
        });

        return new Response("OK");
    } catch (err) {
        if (err instanceof z.ZodError) {
            return new Response("Invalid Request Data Passed", { status: 422 });
        }

        return new Response(
            "Could not Post to Subreddit, please try again later",
            {
                status: 500,
            }
        );
    }
}
