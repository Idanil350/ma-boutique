import { useState, useEffect } from 'react'

const exchangeRates = {
  EUR: 1,
  XAF: 655.957, // 1 EUR = 655.957 XAF
  USD: 1.08     // 1 EUR = 1.08 USD
}

export function useCurrency() {
  const [currency, setCurrency] = useState('EUR')
  
  useEffect(() => {
    // Détecter la position du client (simplifié)
    const locale = navigator.language
    if (locale.includes('CM') || locale.includes('fr-CM')) {
      setCurrency('XAF')
    } else if (locale.includes('US')) {
      setCurrency('USD')
    } else {
      setCurrency('EUR')
    }
  }, [])

  const convertPrice = (price, fromCurrency = 'EUR') => {
    // Convertir en EUR d'abord
    const priceInEUR = price / exchangeRates[fromCurrency]
    // Puis convertir vers la devise cible
    return priceInEUR * exchangeRates[currency]
  }

  const formatPrice = (price) => {
    const converted = convertPrice(price)
    const symbols = { EUR: '€', XAF: 'FCFA', USD: '$' }
    
    if (currency === 'XAF') {
      return `${Math.round(converted)} ${symbols[currency]}`
    }
    return `${converted.toFixed(2)} ${symbols[currency]}`
  }

  return { currency, setCurrency, convertPrice, formatPrice }
}