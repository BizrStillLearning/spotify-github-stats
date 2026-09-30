import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
    title: 'Spotify Synthwave Stats Generator',
    description: 'Generate dynamic GitHub README activity cards for your Spotify and Last.fm scrobbles.',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="antialiased selection:bg-[#ff2a85] selection:text-white">
        {children}
        </body>
        </html>
    );
}