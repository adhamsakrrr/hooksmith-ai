import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
    weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
    title: 'HookSmith AI | Viral Hook Engine',
    description: 'Generate 20+ viral hooks in seconds using Groq Llama 3.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-black text-white antialiased`}>
                {children}
            </body>
        </html>
    );
}
