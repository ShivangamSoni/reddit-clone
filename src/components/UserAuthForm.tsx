'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

import { Button } from './ui/Button';
import Icons from './Icons';
import { useToast } from '@/hooks/useToast';

export default function UserAuthForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const loginWithGoogle = async () => {
        setIsLoading(true);

        try {
            await signIn('google');
        } catch (err) {
            toast({
                title: 'There was a problem.',
                description: 'There was an Error logging n with Google',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center">
            <Button onClick={loginWithGoogle} isLoading={isLoading} size="sm">
                <span
                    aria-hidden="true"
                    className="flex items-center justify-center"
                >
                    <Icons.google className="w-3 h-3" />
                    oogle
                </span>
                <span className="sr-only">Sign-In with Google</span>
            </Button>
        </div>
    );
}
