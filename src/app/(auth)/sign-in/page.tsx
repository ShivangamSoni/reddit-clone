import Link from 'next/link';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/Button';
import SignIn from '@/components/SignIn';

export default function SignInPage() {
    return (
        <div className="absolute inset-0">
            <div className="w-full max-w-screen-sm h-full mx-auto flex flex-col items-center justify-center gap-20">
                <Link
                    href="/"
                    className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'self-start -mt-20',
                    )}
                >
                    Home
                </Link>

                <SignIn />
            </div>
        </div>
    );
}
