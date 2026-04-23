import './globals.css';
import Navbar from './components/Navbar';
import SessionProvider from './components/SessionProvider';
import MainWrapper from './components/MainWrapper';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KarrirPath',
  description: 'Platform karir inklusif untuk anak muda Indonesia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">
        <SessionProvider>
          <Navbar />
          <MainWrapper>{children}</MainWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}