'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ListTodo, Scale, User, DollarSign, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/', icon: Home, label: 'Ana Sayfa' },
  { href: '/tasks', icon: ListTodo, label: 'Görevler' },
  { href: '/hearings', icon: Scale, label: 'Duruşmalar' },
  { href: '/clients', icon: User, label: 'Müvekkiller' },
  { href: '/finance', icon: DollarSign, label: 'Finans' },
  { href: '/settings', icon: Settings, label: 'Ayarlar' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-[hsl(var(--card-border))] safe-bottom">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex items-center justify-center transition-colors ${
                  isActive ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className={`text-[10px] font-medium transition-colors ${
                isActive ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeBottomTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 gradient-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
