'use client'

import Link from 'next/link'
import { Bell, User, Search, Menu } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="lg:hidden sticky top-0 z-50 w-full glass-effect border-b border-[hsl(var(--card-border))]">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))] to-[#8b5cf6] shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EA</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm text-[hsl(var(--foreground))]">Av. Emre Arslan</h1>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Hukuk Bürosu</p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <Search className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
            </motion.button>

            {/* Notifications Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <Bell className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </motion.button>
            
            {/* Profile Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl hover:bg-[hsl(var(--accent))] transition-colors"
            >
              <User className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  )
}
