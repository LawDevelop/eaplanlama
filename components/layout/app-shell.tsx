'use client'

import { usePathname } from 'next/navigation'
import { DesktopSidebar } from './desktop-sidebar'
import { Header } from './header'
import { BottomNav } from './bottom-nav'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname?.startsWith('/login')

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
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
  )
}
