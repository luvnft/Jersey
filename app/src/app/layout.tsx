import { Providers } from '@/components/providers';
import './layout.css'; // Import your CSS file
import Link from 'next/link'; // Import Next.js Link for better navigation

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="main-layout">
            <header className="header">
              <div className="logo">
                <Link href="/"> {/* Use Next.js Link for the logo */}
                  <img src="/your-logo.svg" alt="Your Logo" className="logo-image" />
                </Link>
              </div>
              <nav className="navigation">
                <Link href="/browse"> {/* Use Link for navigation */}
                  Browse
                </Link>
                <Link href="/radio">
                  Radio
                </Link>
                <Link href="/my-music">
                  My Music
                </Link>
                {/* Add more navigation links as needed */}
              </nav>
              <div className="user-profile">
                <button className="connect-button">Connect Wallet</button>
                {/* Add user icon/avatar here */}
              </div>
            </header>

            <main className="main-content">
              {children}
            </main>

            <footer className="footer">
              <p>&copy; 2025 LUV NFT MU$IK. All rights reserved.</p>
              {/* Add any other footer links or information */}
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}