'use client'

import { ListTodo, Scale, DollarSign, FileText, Calendar, Users, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const stats = [
  {
    icon: ListTodo,
    label: 'Aktif Görevler',
    value: '12',
    href: '/tasks',
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: Scale,
    label: 'Duruşmalar',
    value: '5',
    href: '/hearings',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: DollarSign,
    label: 'Aylık Gelir',
    value: '₺150K',
    href: '/finance',
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    icon: FileText,
    label: 'Belgeler',
    value: '48',
    href: '/documents',
    gradient: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
]

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Link key={stat.label} href={stat.href}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-2xl ${stat.bg} border ${stat.border} cursor-pointer transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold mb-0.5">{stat.value}</div>
              <div className="text-xs text-[hsl(var(--muted-foreground))] font-medium">{stat.label}</div>
            </motion.div>
          </Link>
        )
      })}
    </div>
  )
}
