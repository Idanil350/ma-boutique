'use client'
import Image from 'next/image'
import { useCartStore } from '@/lib/cartStore'
import { ShoppingCart, Check } from 'lucide-react'
import { useState } from 'react'

export default function ProductCard({ product, formatPrice }) {
  const addItem = useCartStore((state) => state.addItem)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-gray-800">
            {formatPrice(product.price)}
          </span>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 rounded-md transition-all flex items-center space-x-2 ${
              product.stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : added
                ? 'bg-green-600 text-white'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                <span>Ajouté</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Ajouter</span>
              </>
            )}
          </button>
        </div>
        
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-sm text-orange-600 mt-2">
            Plus que {product.stock} en stock !
          </p>
        )}
        
        {product.stock === 0 && (
          <p className="text-sm text-red-600 mt-2">
            Rupture de stock
          </p>
        )}
      </div>
    </div>
  )
}