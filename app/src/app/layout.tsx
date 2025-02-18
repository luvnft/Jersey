import { Providers } from '@/components/providers';
import './layout.css'; // Import your CSS file

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="main-layout">
            <header className="header">
              <div className="logo">
                {/* Replace with your actual logo */}
                <img src="/your-logo.svg" alt="Your Logo" className="logo-image" /> 
              </div>
              <nav className="navigation">
                <a href="#">Browse</a>
                <a href="#">Radio</a>
                <a href="#">My Music</a>
                {/* Add more navigation links as needed */}
              </nav>
              <div className="user-profile">
                <button className="connect-button">Connect Wallet</button>
                {/* Add user icon/avatar here */}
              </div>
            </header>

            <main className="main-content">
              {children}  {/* This is where your Dapp's content goes */}
            </main>

            <footer className="footer">
              <p>&copy; 2024 Your Dapp Name. All rights reserved.</p>
              {/* Add any other footer links or information */}
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}


// layout.css
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure full viewport height */
  font-family: sans-serif; /* Use a clean, modern font */
  background-color: #111; /* Dark background */
  color: #fff; /* Light text */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #333; /* Subtle separator */
}

.logo {
  /* Style your logo container as needed */
}

.logo-image {
  max-height: 40px; /* Adjust the height to fit your logo */
}

.navigation {
  display: flex;
  gap: 20px;
}

.navigation a {
  color: #fff;
  text-decoration: none;
}

.user-profile {
  display: flex;
  align-items: center;
}

.connect-button {
  background-color: #007bff; /* Example blue color */
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.main-content {
  flex: 1; /* Allow main content to take up available space */
  padding: 20px;
}

.footer {
  padding: 20px;
  text-align: center;
  border-top: 1px solid #333;
}

/* Add more styles as needed to match the specific look you want */
