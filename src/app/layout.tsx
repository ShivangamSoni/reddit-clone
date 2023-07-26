import { Inter } from 'next/font/google';

import { cn } from '@/lib/utils';

import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/Toaster';

export const metadata = {
    title: 'Reddit Clone',
    description:
        'A Reddit clone built with Next.js, TypeScript, TailwindCSS & shadcn',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
    authModal,
}: {
    children: React.ReactNode;
    authModal: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={cn(
                'bg-white text-slate-900 antialiased light',
                inter.className,
            )}
        >
            <body className="min-h-screen p-12 bg-slate-50">
                {/* @ts-expect-error Async Server Component */}
                <Navbar />

                <div className="container max-w-screen-xl mx-auto h-full pt-12">
                    {children}
                </div>

                {authModal}

                <Toaster />
            </body>
        </html>
    );
}
