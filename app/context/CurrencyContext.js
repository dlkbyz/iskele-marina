'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

export const currencies = {
  EUR: { symbol: '€', rate: 1, name: 'Euro' },
  USD: { symbol: '$', rate: 1.09, name: 'Dolar' },
  TRY: { symbol: '₺', rate: 50.50, name: 'Türk Lirası' },
  GBP: { symbol: '£', rate: 0.83, name: 'Sterlin' }
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('EUR')
  const [rates, setRates] = useState(currencies)
  const [loading, setLoading] = useState(false)

  // Döviz kurlarını API'den çek
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true)
      try {
        // exchangerate.host API'sini kullan (ücretsiz, rate limit yok)
        const response = await fetch('https://api.exchangerate.host/latest?base=EUR')
        const data = await response.json()
        
        if (data.success || data.rates) {
          const newRates = {
            EUR: { symbol: '€', rate: 1, name: 'Euro' },
            USD: { symbol: '$', rate: data.rates.USD || 1.09, name: 'Dolar' },
            TRY: { symbol: '₺', rate: data.rates.TRY || 50.50, name: 'Türk Lirası' },
            GBP: { symbol: '£', rate: data.rates.GBP || 0.83, name: 'Sterlin' }
          }
          setRates(newRates)
        }
      } catch (error) {
        console.error('Döviz kurları çekilirken hata:', error)
        // Hata durumunda sabit kurları kullan
        setRates(currencies)
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
    
    // Her 1 saat (3600000ms) de kurları güncelle
    const interval = setInterval(fetchRates, 3600000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // LocalStorage'dan kayıtlı para birimini yükle
    const saved = localStorage.getItem('currency')
    if (saved && rates[saved]) {
      setCurrency(saved)
    }
  }, [rates])

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency)
    localStorage.setItem('currency', newCurrency)
  }

  const convertPrice = (price) => {
    return (price * rates[currency].rate).toFixed(2)
  }

  const formatPrice = (price) => {
    const converted = convertPrice(price)
    return `${rates[currency].symbol}${converted}`
  }

  // Fiyatı seçilen para birimine çevir ve en yakın 100'lüğe yuvarla
  const getPriceRoundedToHundred = (basePrice) => {
    const converted = parseFloat((basePrice * rates[currency].rate).toFixed(2))
    const rounded = Math.round(converted / 100) * 100
    return `${rates[currency].symbol}${rounded}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, convertPrice, formatPrice, getPriceRoundedToHundred, rates, loading, currencies: rates }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}