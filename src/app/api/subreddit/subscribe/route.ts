import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        const { subredditId } = SubredditSubscriptionValidator.parse(body);

        const isSubscribed = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id,
            },
        });

        if (isSubscribed) {
            return new Response("You're already Subscribed to this Subreddit", {
                status: 400,
            });
        }

        await db.subscription.create({
            data: {
                subredditId,
                userId: session.user.id,
            },
        });
        return new Response(subredditId);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return new Response("Invalid Request Data Passed", { status: 422 });
        }

        return new Response("Could not Subscribe, please try again later", {
            status: 500,
        });
    }
}
