import { Providers } from '@/components/providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="layout-container"> {/* Optional: Add className for layout styling if needed */}
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}