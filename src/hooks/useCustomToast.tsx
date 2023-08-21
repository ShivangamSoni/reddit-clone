import Link from "next/link";
import { toast } from "./useToast";
import { buttonVariants } from "@/components/ui/Button";

export function useCustomToast() {
    const loginToast = () => {
        const { dismiss } = toast({
            title: "Login Required",
            description: "You need to be Logged-In to do that.",
            variant: "destructive",
            action: (
                <Link
                    href="/sign-in"
                    onClick={() => dismiss()}
                    className={buttonVariants({ variant: "outline" })}
                >
                    Login
                </Link>
            ),
        });
    };

    return { loginToast };
}
