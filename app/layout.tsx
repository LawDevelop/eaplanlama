import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Header } from '@/components/layout/header'
import { BottomNav } from '@/components/layout/bottom-nav'
import { DesktopSidebar } from '@/components/layout/desktop-sidebar'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Hukuk Bürosu Yönetim Sistemi',
  description: 'Mobil-öncelikli hukuk bürosu yönetim, finans ve görev otomasyon sistemi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen flex">
            {/* Desktop Sidebar - Hidden on mobile */}
            <DesktopSidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64">
              {/* Mobile Header - Hidden on desktop */}
              <Header />
              
              {/* Main Content */}
              <main className="flex-1 pb-20 lg:pb-6">
                {children}
              </main>
              
              {/* Mobile Bottom Navigation - Hidden on desktop */}
              <BottomNav />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
