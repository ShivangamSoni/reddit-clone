"use client";

import { useCustomToast } from "@/hooks/useCustomToast";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PostVoteRequest } from "@/lib/validators/votes";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/useToast";

interface Props {
    postId: string;
    initialVotesAmt: number;
    initialVote?: VoteType | null;
}

export default function PostVoteClient({
    postId,
    initialVotesAmt,
    initialVote,
}: Props) {
    const { loginToast } = useCustomToast();
    const [votesAmt, setVotesAmt] = useState(initialVotesAmt);
    const [currentVote, setCurrentVote] = useState(initialVote);
    const previousVote = usePrevious(currentVote);

    const { mutateAsync: vote, isLoading: isVoting } = useMutation({
        async mutationFn(voteType: VoteType) {
            const payload: PostVoteRequest = {
                postId,
                voteType,
            };

            await axios.patch("/api/subreddit/post/vote", payload);
        },
        onError(err, voteType) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast();
                }
            }

            if (voteType === "up") {
                setVotesAmt((prev) => prev - 1);
            } else {
                setVotesAmt((prev) => prev + 1);
            }

            setCurrentVote(previousVote);

            return toast({
                title: "Something Went Wrong",
                description: "Your Vote was not registered, please try again.",
                variant: "destructive",
            });
        },
        onMutate(voteType) {
            if (currentVote === voteType) {
                setCurrentVote(null);

                if (voteType === "up") {
                    setVotesAmt((prev) => prev - 1);
                } else if (voteType === "down") {
                    setVotesAmt((prev) => prev + 1);
                }
            } else {
                setCurrentVote(voteType);

                if (voteType === "up") {
                    setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
                } else if (voteType === "down") {
                    setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
                }
            }
        },
    });

    useEffect(() => {
        setCurrentVote(initialVote);
    }, [initialVote]);

    return (
        <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
            <Button
                onClick={() => vote("up")}
                disabled={isVoting}
                variant="ghost"
                size="sm"
                aria-label="upvote"
            >
                <ArrowBigUp
                    className={cn("h-5 w-5 text-zinc-700", {
                        "text-emerald-500 fill-emerald-500":
                            currentVote === "up",
                    })}
                />
            </Button>

            <p className="text-center py-2 font-medium text-sm text-zinc-700">
                {votesAmt}
            </p>

            <Button
                onClick={() => vote("down")}
                disabled={isVoting}
                variant="ghost"
                size="sm"
                aria-label="downvote"
            >
                <ArrowBigDown
                    className={cn("h-5 w-5 text-zinc-700", {
                        "text-rose-500 fill-rose-500": currentVote === "down",
                    })}
                />
            </Button>
        </div>
    );
}
