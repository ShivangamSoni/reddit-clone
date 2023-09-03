import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { buttonVariants } from "../ui/Button";

export default function PostVoteShell() {
    return (
        <div className="flex items-center flex-col pr-6 w-20">
            {/* upvote */}
            <div className={buttonVariants({ variant: "ghost" })}>
                <ArrowBigUp className="h-5 w-5 text-zinc-700" />
            </div>

            {/* score */}
            <div className="text-center py-2 font-medium text-sm text-zinc-900">
                <Loader2 className="h-3 w-3 animate-spin" />
            </div>

            {/* downvote */}
            <div className={buttonVariants({ variant: "ghost" })}>
                <ArrowBigDown className="h-5 w-5 text-zinc-700" />
            </div>
        </div>
    );
}
