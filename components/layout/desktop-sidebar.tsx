'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  ListTodo,
  Scale,
  User,
  DollarSign,
  Settings,
  Calendar,
  FileText,
  LogOut
} from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

const navSections = [
  {
    title: 'Ana Menü',
    items: [
      { href: '/', icon: Home, label: 'Dashboard' },
      { href: '/tasks', icon: ListTodo, label: 'Görevler' },
      { href: '/hearings', icon: Scale, label: 'Duruşmalar' },
      { href: '/calendar', icon: Calendar, label: 'Takvim' },
    ]
  },
  {
    title: 'Yönetim',
    items: [
      { href: '/clients', icon: User, label: 'Müvekkiller' },
      { href: '/documents', icon: FileText, label: 'Belgeler' },
      { href: '/finance', icon: DollarSign, label: 'Finans' },
      { href: '/settings', icon: Settings, label: 'Ayarlar' },
    ]
  }
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside className="sidebar shadow-2xl w-64">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">EA</span>
          </div>
          <div className="flex-shrink-0">
            <h1 className="font-semibold text-white text-sm">Av. Emre Arslan</h1>
            <p className="text-[10px] text-white/60">Hukuk Bürosu</p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto sidebar-scrollbar py-4">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="px-6 mb-2 text-xs font-semibold text-white/40 uppercase tracking-wider">
              {section.title}
            </p>
            <nav>
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                      className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
                      <span className="flex-1">
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-1 h-1 rounded-full bg-white"
                        />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1">Çıkış</span>
        </motion.button>
      </div>
    </aside>
  )
}
