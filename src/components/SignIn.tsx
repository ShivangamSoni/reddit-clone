import Link from 'next/link';

import { buttonVariants } from './ui/Button';
import Icons from './Icons';
import UserAuthForm from './UserAuthForm';

export default function SignIn() {
    return (
        <div className="container w-full sm:w-[500px] flex flex-col justify-center space-y-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <Icons.logo className="h-8 w-8" />

                <h2 className="text-2xl font-semibold tracking-light">
                    Welcome back!
                </h2>

                <p className="text-sm max-w-xs">
                    By continuing, you are setting up a Reddit Clone account and
                    agreeing to our User Agreement and Privacy Policy.
                </p>

                <UserAuthForm />

                <p className="px-8 text-center text-sm text-zinc-700">
                    New to Reddit Clone?{' '}
                    <Link
                        href="/sign-up"
                        className={buttonVariants({
                            variant: 'link',
                            size: 'xs',
                        })}
                    >
                        Sign Up
                    </Link>
                    .
                </p>
            </div>
        </div>
    );
}
