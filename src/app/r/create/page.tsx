"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import { toast } from "@/hooks/useToast";
import { useCustomToast } from "@/hooks/useCustomToast";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CreateCommunity() {
    const [input, setInput] = useState("");
    const { back, push } = useRouter();
    const { loginToast } = useCustomToast();

    const { mutate: createCommunity, isLoading } = useMutation({
        async mutationFn() {
            const payload: CreateSubredditPayload = {
                name: input,
            };
            const { data } = await axios.post("/api/subreddit", payload);
            return data as string;
        },
        onError(err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: "Subreddit already exists",
                        description:
                            "Please choose a different subreddit name.",
                        variant: "destructive",
                    });
                } else if (err.response?.status === 422) {
                    return toast({
                        title: "Invalid Subreddit Name",
                        description:
                            "Please choose a name between 3 & 21 Characters.",
                        variant: "destructive",
                    });
                } else if (err.response?.status === 401) {
                    return loginToast();
                }
            }

            toast({
                title: "There was an Error",
                description: "Could not create subreddit",
                variant: "destructive",
            });
        },
        onSuccess(data) {
            push(`/r/${data}`);
        },
    });

    return (
        <div className="container flex items-center h-full max-w-3xl mx-auto">
            <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">
                        Create a Community
                    </h1>
                </div>

                <hr className="bg-zinc-500 h-px" />

                <div>
                    <p className="text-lg font-medium">Name</p>
                    <p>
                        Community names including capitalization cannot be
                        changed.
                    </p>

                    <div className="relative mt-2">
                        <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                            r/
                        </p>

                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="pl-6"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="subtle" onClick={back}>
                        Cancel
                    </Button>
                    <Button
                        isLoading={isLoading}
                        disabled={input.length === 0}
                        onClick={() => createCommunity()}
                    >
                        Create Community
                    </Button>
                </div>
            </div>
        </div>
    );
}
