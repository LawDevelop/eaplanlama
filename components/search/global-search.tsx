'use client'

import { useState, useEffect } from 'react'
import { Search, X, Clock, FileText, Scale, ListTodo, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface SearchResult {
  id: string
  type: 'task' | 'hearing' | 'financial' | 'client'
  title: string
  subtitle?: string
  date?: string
  href?: string
}

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches] = useState(['Ahmet Yılmaz', 'Boşanma Davası', '2024/123'])

  useEffect(() => {
    if (query.length > 0) {
      setIsOpen(true)
      // TODO: Implement actual search with Supabase
      // For now, mock results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'client',
          title: 'Ahmet Yılmaz',
          subtitle: 'Boşanma Davası - 2024/123',
          href: '/clients'
        },
        {
          id: '2',
          type: 'hearing',
          title: 'Boşanma Davası',
          subtitle: 'Ankara 5. Aile Mahkemesi - 10:00',
          date: 'Bugün',
          href: '/hearings'
        },
        {
          id: '3',
          type: 'task',
          title: 'Dilekçe hazırla',
          subtitle: 'Mehmet Demir - 2024/124',
          date: 'Yarın',
          href: '/tasks'
        },
      ]
      setResults(mockResults.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle?.toLowerCase().includes(query.toLowerCase())
      ))
    } else {
      setIsOpen(false)
      setResults([])
    }
  }, [query])

  const getIcon = (type: string) => {
    switch (type) {
      case 'task': return ListTodo
      case 'hearing': return Scale
      case 'financial': return FileText
      case 'client': return User
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'task': return 'bg-purple-100 text-purple-600'
      case 'hearing': return 'bg-blue-100 text-blue-600'
      case 'financial': return 'bg-green-100 text-green-600'
      case 'client': return 'bg-orange-100 text-orange-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'task': return 'Görev'
      case 'hearing': return 'Duruşma'
      case 'financial': return 'Finans'
      case 'client': return 'Müvekkil'
      default: return 'Diğer'
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Müvekkil adı, dosya no, görev veya duruşma ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="pl-12 pr-10 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-500 bg-gray-50/50 text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Results Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100"
            >
              {/* Recent Searches */}
              {query.length === 0 && recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-3">
                    <Clock className="w-3 h-3" />
                    SON ARAMALAR
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => setQuery(search)}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {results.length > 0 ? (
                <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                  {results.map((result) => {
                    const Icon = getIcon(result.type)
                    return (
                      <Link
                        key={result.id}
                        href={result.href || '#'}
                        onClick={() => {
                          setIsOpen(false)
                          setQuery('')
                        }}
                      >
                        <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                          <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-gray-500 truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 flex-shrink-0">
                            {result.date && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full">
                                {result.date}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-medium text-gray-400 flex-shrink-0">
                            {getTypeLabel(result.type)}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : query.length > 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Sonuç bulunamadı</p>
                  <p className="text-sm text-gray-400 mt-1">Başka bir arama terimi deneyin</p>
                </div>
              ) : null}

              {/* Keyboard Shortcuts */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Aramak için Enter</span>
                <span>Kapatmak için ESC</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
