"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/Button";
import { SubscribeSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/useToast";
import { startTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
    isSubscribed: boolean;
    subredditId: string;
    subredditName: string;
}

export default function SubscribeLeaveToggle({
    subredditId,
    subredditName,
    isSubscribed,
}: Props) {
    const router = useRouter();
    const { loginToast } = useCustomToast();

    const { mutate: subscribe, isLoading: isSubscribing } = useMutation({
        async mutationFn() {
            const payload: SubscribeSubredditPayload = {
                subredditId,
            };
            const { data } = await axios.post(
                "/api/subreddit/subscribe",
                payload
            );
            return data as string;
        },
        onError(err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast();
                }
            }

            return toast({
                title: "There was a Problem",
                description: "Something went Wrong. Please, Try Again.",
                variant: "destructive",
            });
        },
        onSuccess() {
            startTransition(() => router.refresh());

            return toast({
                title: "Subscribed",
                description: `You are now subscribed to "${subredditName}"`,
            });
        },
    });

    const { mutate: unsubscribe, isLoading: isUnsubscribing } = useMutation({
        async mutationFn() {
            const payload: SubscribeSubredditPayload = {
                subredditId,
            };
            const { data } = await axios.post(
                "/api/subreddit/unsubscribe",
                payload
            );
            return data as string;
        },
        onError(err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast();
                }
            }

            return toast({
                title: "There was a Problem",
                description: "Something went Wrong. Please, Try Again.",
                variant: "destructive",
            });
        },
        onSuccess() {
            startTransition(() => router.refresh());

            return toast({
                title: "Unsubscribed",
                description: `You are now Unsubscribed from "${subredditName}"`,
            });
        },
    });

    return isSubscribed ? (
        <Button
            className="w-full mt-1 mb-4"
            onClick={() => unsubscribe()}
            isLoading={isUnsubscribing}
        >
            Leave Community
        </Button>
    ) : (
        <Button
            className="w-full mt-1 mb-4"
            onClick={() => subscribe()}
            isLoading={isSubscribing}
        >
            Join the Community
        </Button>
    );
}
