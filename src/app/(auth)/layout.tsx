import Link from 'next/link';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/Button';
import { HomeIcon } from 'lucide-react';

export default function SignInPage({
    children,
}: {
    children: React.ReactNode;
}) {
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
                    <HomeIcon className="w-4 h-4" />
                    &nbsp;
                    <span>Home</span>
                </Link>

                {children}
            </div>
        </div>
    );
}
