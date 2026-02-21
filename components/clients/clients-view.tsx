'use client'

import { useState } from 'react'
import { Plus, Search, User, Building2, Phone, Mail, FileText, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface Client {
  id: string
  name: string
  clientType: 'individual' | 'corporate'
  phone?: string
  email?: string
  totalCases: number
  activeCases: number
  totalPaid: number
  totalDebt: number
  status: 'active' | 'inactive' | 'archived'
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    clientType: 'individual',
    phone: '0532 123 45 67',
    email: 'ahmet@example.com',
    totalCases: 3,
    activeCases: 1,
    totalPaid: 25000,
    totalDebt: 5000,
    status: 'active',
  },
  {
    id: '2',
    name: 'ABC Şirketi A.Ş.',
    clientType: 'corporate',
    phone: '0312 456 78 90',
    email: 'info@abc.com',
    totalCases: 5,
    activeCases: 2,
    totalPaid: 150000,
    totalDebt: 0,
    status: 'active',
  },
]

export function ClientsView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'corporate'>('all')

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || client.clientType === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen pb-24 lg:pb-24">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gradient mb-2">Müvekkiller</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Müvekkil bilgilerini yönetin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="elite-card p-4">
            <div className="text-2xl font-bold text-[hsl(var(--primary))]">{mockClients.length}</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Toplam Müvekkil</div>
          </div>
          <div className="elite-card p-4">
            <div className="text-2xl font-bold text-green-600">{mockClients.filter(c => c.status === 'active').length}</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Aktif</div>
          </div>
          <div className="elite-card p-4">
            <div className="text-2xl font-bold text-blue-600">{mockClients.reduce((sum, c) => sum + c.activeCases, 0)}</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Aktif Dava</div>
          </div>
          <div className="elite-card p-4">
            <div className="text-2xl font-bold text-orange-600">{mockClients.filter(c => c.totalDebt > 0).length}</div>
            <div className="text-sm text-[hsl(var(--muted-foreground))]">Borçlu</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            <input
              type="text"
              placeholder="Müvekkil ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="elite-input pl-12"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filterType === 'all'
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilterType('individual')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                filterType === 'individual'
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
              }`}
            >
              <User className="w-4 h-4" />
              Bireysel
            </button>
            <button
              onClick={() => setFilterType('corporate')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                filterType === 'corporate'
                  ? 'gradient-primary text-white shadow-lg'
                  : 'bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Kurumsal
            </button>
          </div>
        </div>

        {/* Clients List */}
        <div className="space-y-3">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="elite-card p-5 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  client.clientType === 'individual' 
                    ? 'bg-blue-500/10' 
                    : 'bg-purple-500/10'
                }`}>
                  {client.clientType === 'individual' ? (
                    <User className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Building2 className="w-6 h-6 text-purple-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{client.name}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                        {client.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                      client.status === 'active'
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-gray-500/10 text-gray-600'
                    }`}>
                      {client.status === 'active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[hsl(var(--secondary))]">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-[hsl(var(--primary))]" />
                        <span className="text-xs text-[hsl(var(--muted-foreground))]">Dosyalar</span>
                      </div>
                      <div className="font-bold">{client.totalCases} <span className="text-sm font-normal text-[hsl(var(--muted-foreground))]">({client.activeCases} aktif)</span></div>
                    </div>

                    <div className="p-3 rounded-xl bg-green-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600">Ödenen</span>
                      </div>
                      <div className="font-bold text-green-600">₺{client.totalPaid.toLocaleString('tr-TR')}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-orange-500/10">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                        <span className="text-xs text-orange-600">Borç</span>
                      </div>
                      <div className="font-bold text-orange-600">₺{client.totalDebt.toLocaleString('tr-TR')}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-500/10">
                      <div className="text-xs text-blue-600 mb-1">Duruşmalar</div>
                      <div className="font-bold text-blue-600">{client.totalCases * 2}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="elite-card p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-[hsl(var(--muted-foreground))]" />
            <p className="text-[hsl(var(--muted-foreground))]">Müvekkil bulunamadı</p>
          </div>
        )}

        {/* Add Button */}
        <button
          className="fixed bottom-24 lg:bottom-24 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 gradient-primary rounded-full shadow-2xl flex items-center justify-center text-white z-40 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
          type="button"
        >
          <Plus className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>
    </div>
  )
}
