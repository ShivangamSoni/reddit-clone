import '@/styles/globals.css';

export const metadata = {
  title: 'Reddit Clone',
  description:
    'A Reddit clone built with Next.js, TypeScript, TailwindCSS & shadcn',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
