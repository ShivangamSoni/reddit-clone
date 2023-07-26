'use client';

import { User } from 'next-auth';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/DropdownMenu';
import UserAvatar from './UserAvatar';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface Props {
    user: Pick<User, 'name' | 'email' | 'image'>;
}

export default function UserActionBar({ user }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar user={user} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white" align="end">
                <div className="flex items-center gap-2 p-2">
                    <div className="flex-flex-col gap-1 leading-none">
                        {user.name && (
                            <p className="font-medium">{user.name}</p>
                        )}
                        {user.email && (
                            <p
                                title={user.email}
                                className="w-48 text-sm truncate text-zinc-700"
                            >
                                {user.email}
                            </p>
                        )}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <Link className="w-full" href="/">
                        Feed
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Link className="w-full" href="/r/create">
                        Create Community
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Link className="w-full" href="/settings">
                        Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        signOut({
                            callbackUrl: `/sign-in`,
                        });
                    }}
                    className="cursor-pointer"
                >
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
