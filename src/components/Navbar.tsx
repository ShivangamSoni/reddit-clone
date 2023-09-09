import Link from "next/link";

import { getAuthSession } from "@/lib/auth";

import Icons from "./Icons";
import UserActionBar from "./UserActionBar";
import { buttonVariants } from "./ui/Button";
import SearchBar from "./SearchBar";

export default async function Navbar() {
    const session = await getAuthSession();

    return (
        <header className="fixed top-0 inset-x-0 bg-zinc-100 border-b border-zinc-300 z-10 py-2">
            <div className="container flex items-center justify-between gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <Icons.logo className="w-12 h-12 sm:w-16 sm:h-16" />
                    <h1 className="hidden md:block text-zinc-700 text-sm font-semibold">
                        Reddit Clone 😜
                    </h1>
                </Link>

                <SearchBar />

                {session?.user ? (
                    <UserActionBar user={session.user} />
                ) : (
                    <Link href="/sign-in" className={buttonVariants()}>
                        Sign In
                    </Link>
                )}
            </div>
        </header>
    );
}
