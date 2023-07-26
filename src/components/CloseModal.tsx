'use client';

import { useRouter } from 'next/navigation';

import { X } from 'lucide-react';

import { Button } from './ui/Button';

export default function CloseModal() {
    const router = useRouter();

    return (
        <Button
            onClick={() => router.back()}
            variant="subtle"
            size="sm"
            aria-label="close modal"
        >
            <X className="w-4 h-4" />
        </Button>
    );
}
