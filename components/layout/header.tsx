'use client'

import Link from 'next/link'
import { Bell, User } from 'lucide-react'
import { motion } from 'framer-motion'

export function Header() {
  return (
    <header className="lg:hidden sticky top-0 z-50 w-full glass-effect border-b border-[hsl(var(--card-border))]">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] shadow-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EA</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm text-[#1e3a8a]">Av. Emre Arslan</h1>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Hukuk Bürosu</p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  )
}
