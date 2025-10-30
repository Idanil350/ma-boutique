'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { useCartStore } from '@/lib/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

const exchangeRates = {
  EUR: 1,
  XAF: 655.957,
  USD: 1.08
}

export default function CartPage() {
  const router = useRouter()
  const [currency, setCurrency] = useState('XAF')
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  const formatPrice = (price) => {
    const priceInEUR = price / exchangeRates['EUR']
    const converted = priceInEUR * exchangeRates[currency]
    const symbols = { EUR: '€', XAF: 'FCFA', USD: '$' }
    
    if (currency === 'XAF') {
      return `${Math.round(converted)} ${symbols[currency]}`
    }
    return `${converted.toFixed(2)} ${symbols[currency]}`
  }

  const total = getTotalPrice()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currency={currency} setCurrency={setCurrency} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Mon Panier</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Ajoutez des produits pour commencer vos achats</p>
            <Link href="/" className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition inline-block">
              Continuer mes achats
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Liste des produits */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4">
                  <div className="relative h-24 w-24 flex-shrink-0 bg-gray-100 rounded">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description.substring(0, 60)}...</p>
                    <p className="text-xl font-bold text-gray-800 mt-2">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition"
                    >
                      <Minus className="h-4 w-4 text-gray-700" />
                    </button>
                    <span className="text-lg font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-gray-200 p-2 rounded-md hover:bg-gray-300 transition"
                    >
                      <Plus className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Vider le panier
              </button>
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Résumé</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="text-gray-900 font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="text-green-600 font-semibold">À confirmer</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <Link 
                  href="/checkout"
                  className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold text-center block"
                >
                  Passer la commande
                </Link>

                <Link href="/" className="block text-center text-gray-600 hover:text-gray-900 mt-4">
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}