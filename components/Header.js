'use client'
import Link from 'next/link'
import { ShoppingCart, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/cartStore'

export default function Header({ currency, setCurrency }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const totalItems = getTotalItems()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-2 rounded-lg">
              <span className="text-2xl font-bold">WIN</span>
            </div>
            <span className="text-2xl font-bold">SHOP</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/#chaussures" className="text-gray-300 hover:text-white transition">
              Chaussures
            </Link>
            <Link href="/#perruques" className="text-gray-300 hover:text-white transition">
              Perruques
            </Link>
            <Link href="/#sacs" className="text-gray-300 hover:text-white transition">
              Sacs
            </Link>
            <Link href="/#tech-ai" className="text-gray-300 hover:text-white transition">
              Tech IA
            </Link>
            <Link href="/#consoles" className="text-gray-300 hover:text-white transition">
              Consoles
            </Link>
            <Link href="/#hygiene" className="text-gray-300 hover:text-white transition">
              Hygiène
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              <option value="EUR">EUR (€)</option>
              <option value="XAF">XAF (FCFA)</option>
              <option value="USD">USD ($)</option>
            </select>

            {/* LE LIEN ADMIN A ÉTÉ SUPPRIMÉ - Invisible pour les clients */}

            <Link href="/cart" className="relative group">
              <ShoppingCart className="h-6 w-6 text-gray-300 group-hover:text-white transition" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/#chaussures" className="block text-gray-300 hover:text-white py-2">
              Chaussures
            </Link>
            <Link href="/#perruques" className="block text-gray-300 hover:text-white py-2">
              Perruques
            </Link>
            <Link href="/#sacs" className="block text-gray-300 hover:text-white py-2">
              Sacs
            </Link>
            <Link href="/#tech-ai" className="block text-gray-300 hover:text-white py-2">
              Tech IA
            </Link>
            <Link href="/#consoles" className="block text-gray-300 hover:text-white py-2">
              Consoles
            </Link>
            <Link href="/#hygiene" className="block text-gray-300 hover:text-white py-2">
              Hygiène
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
