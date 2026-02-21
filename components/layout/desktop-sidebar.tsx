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
  LogOut,
  ChevronDown,
  TrendingUp,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navSections = [
  {
    title: 'Ana Menü',
    items: [
      { href: '/', icon: Home, label: 'Dashboard', shortcut: '⌘D' },
      { href: '/tasks', icon: ListTodo, label: 'Görevler', shortcut: '⌘T' },
      { href: '/hearings', icon: Scale, label: 'Duruşmalar', shortcut: '⌘H' },
      { href: '/calendar', icon: Calendar, label: 'Takvim', shortcut: '⌘K' },
    ]
  },
  {
    title: 'Yönetim',
    items: [
      { href: '/clients', icon: User, label: 'Müvekkiller', shortcut: '⌘C' },
      { href: '/documents', icon: FileText, label: 'Belgeler', shortcut: '⌘B' },
      { href: '/finance', icon: DollarSign, label: 'Finans', shortcut: '⌘F' },
      { href: '/settings', icon: Settings, label: 'Ayarlar', shortcut: '⌘S' },
    ]
  }
]

export function DesktopSidebar() {
  const pathname = usePathname()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <aside 
      className={cn(
        "sidebar transition-all duration-300 bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]",
        collapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center px-4 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-[hsl(var(--primary))] to-[#8b5cf6] shadow-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">EA</span>
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <h1 className="font-semibold text-white text-sm">Av. Emre Arslan</h1>
                <p className="text-[10px] text-[hsl(var(--sidebar-text))]">Hukuk Bürosu</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto sidebar-scrollbar py-4 px-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 mb-2 text-[10px] font-semibold text-[hsl(var(--sidebar-text))] uppercase tracking-wider"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>
            <nav>
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: collapsed ? 0 : 4 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        "sidebar-link group relative",
                        isActive && "sidebar-link-active"
                      )}
                    >
                      <div className={cn(
                        "flex items-center gap-3",
                        collapsed ? "justify-center" : ""
                      )}>
                        <div className={cn(
                          "relative flex-shrink-0",
                          collapsed ? "w-10 h-10 flex items-center justify-center rounded-xl bg-[hsl(var(--sidebar-surface))]" : ""
                        )}>
                          <Icon className={cn(
                            "w-5 h-5 transition-colors",
                            isActive ? "text-[hsl(var(--sidebar-active))]" : "text-[hsl(var(--sidebar-text))] group-hover:text-white"
                          )} />
                          {isActive && (
                            <motion.div
                              layoutId="activeNav"
                              className="absolute inset-0 bg-[hsl(var(--sidebar-active))]/10 rounded-xl"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </div>
                        <AnimatePresence mode="wait">
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.2 }}
                              className="flex-1 text-sm font-medium"
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      {isActive && !collapsed && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--sidebar-active))]"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
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
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))] space-y-1">
        {/* Collapse Toggle */}
        <motion.button
          whileHover={{ x: collapsed ? 0 : 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setCollapsed(!collapsed)}
          className="sidebar-link w-full justify-center"
        >
          <ChevronDown className={cn(
            "w-5 h-5 flex-shrink-0 transition-transform",
            collapsed && "rotate-180"
          )} />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 text-sm"
              >
                Daralt
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ x: collapsed ? 0 : 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className={cn(
            "sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 text-sm"
              >
                Çıkış
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </aside>
  )
}
