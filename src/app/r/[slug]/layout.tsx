import { ReactNode } from "react";
import { notFound } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

interface Props {
    params: {
        slug: string;
    };
    children: ReactNode;
}

export default async function Layout({ children, params: { slug } }: Props) {
    const session = await getAuthSession();

    const subreddit = await db.subreddit.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                },
            },
        },
    });

    if (!subreddit) {
        return notFound();
    }

    const subscription = !session?.user
        ? undefined
        : await db.subscription.findFirst({
              where: {
                  Subreddit: {
                      name: slug,
                  },
                  user: {
                      id: session.user.id,
                  },
              },
          });
    const isSubscribed = !!subscription;

    const memberCount = await db.subscription.count({
        where: {
            Subreddit: {
                name: slug,
            },
        },
    });

    return (
        <div className="sm:container max-w-7xl mx-auto h-full pt-12">
            <div className="">
                {/* TODO: Back Button */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                    <div className="flex flex-col col-span-2 space-y-6">
                        {children}
                    </div>

                    {/* Info Sidebar */}
                    <div className="sticky top-24 hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
                        <div className="px-6 py-4">
                            <p className="font-semibold py-3">
                                About r/{subreddit.name}
                            </p>
                        </div>

                        <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
                            <div className="flex justify-between items-center gap-x-4 py-3">
                                <dt className="text-gray-500">Created</dt>
                                <dd className="text-gray-900">
                                    <time
                                        dateTime={subreddit.createdAt.toDateString()}
                                    >
                                        {format(
                                            subreddit.createdAt,
                                            "MMMM d, yyyy"
                                        )}
                                    </time>
                                </dd>
                            </div>

                            <div className="flex justify-between items-center gap-x-4 py-3">
                                <dt className="text-gray-500">Members</dt>
                                <dd className="text-gray-900">{memberCount}</dd>
                            </div>

                            {subreddit.creatorId === session?.user.id ? (
                                <div className="flex justify-between items-center gap-x-4 py-3">
                                    <p className="text-gray-500">
                                        You created this community.
                                    </p>
                                </div>
                            ) : (
                                <SubscribeLeaveToggle
                                    isSubscribed={isSubscribed}
                                    subredditId={subreddit.id}
                                    subredditName={subreddit.name}
                                />
                            )}

                            <Link
                                className={buttonVariants({
                                    variant: "outline",
                                    className: "w-full mb-6",
                                })}
                                href={`r/${slug}/submit`}
                            >
                                Create Post
                            </Link>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
