"use client";

import type { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface Props {
    session: Session | null;
}

export default function MiniCreatePost({ session }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const createPost = () => router.push(pathname + "/submit");

    return (
        <li className="overflow-hidden rounded-md bg-white shadow">
            <div className="h-full px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="relative">
                    <UserAvatar
                        user={{
                            name: session?.user.name || null,
                            image: session?.user.image || null,
                        }}
                    />

                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 outline outline-2 outline-white" />
                </div>

                <div className="w-full flex-1 flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-6">
                    <Input
                        readOnly
                        placeholder="Create Post"
                        onClick={createPost}
                    />

                    <div className="flex justify-between items-center gap-1 sm:gap-6">
                        <Button variant="ghost" size="xs" onClick={createPost}>
                            <ImageIcon className="text-zinc-600" />
                        </Button>

                        <Button variant="ghost" size="xs" onClick={createPost}>
                            <Link2 className="text-zinc-600" />
                        </Button>
                    </div>
                </div>
            </div>
        </li>
    );
}
