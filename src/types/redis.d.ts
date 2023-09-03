import { VoteType } from "@prisma/client";

export type CachePost = {
    id: string;
    title: string;
    authorUserName: string;
    content: string;
    currentVote: VoteType | null;
    createdAt: Date;
};
