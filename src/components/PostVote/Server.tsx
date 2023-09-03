import { getAuthSession } from "@/lib/auth";
import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";

import PostVoteClient from "./Client";

interface Props {
    postId: string;
    initialVotesAmnt?: number;
    initialVote?: VoteType | null;
    getData: () => Promise<(Post & { votes: Vote[] }) | null>;
}

export default async function PostVoteServer({
    postId,
    initialVote,
    initialVotesAmnt,
    getData,
}: Props) {
    const session = await getAuthSession();

    let _votesAmnt = 0;
    let _currentVote: VoteType | null = null;

    if (getData) {
        const post = await getData();
        if (!post) return notFound();

        _votesAmnt = post.votes.reduce((acc, vote) => {
            if (vote.type === "up") return acc + 1;
            if (vote.type === "down") return acc - 1;
            return acc;
        }, 0);

        _currentVote =
            post.votes.find((vote) => vote.userId === session?.user.id)?.type ??
            null;
    } else {
        _votesAmnt = initialVotesAmnt!;
        _currentVote = initialVote!;
    }

    return (
        <PostVoteClient
            postId={postId}
            initialVotesAmt={_votesAmnt}
            initialVote={_currentVote}
        />
    );
}
