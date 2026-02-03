'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { getTranslation } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('tr')

  useEffect(() => {
    // localStorage'dan dil tercihini yükle
    const savedLang = localStorage.getItem('language')
    if (savedLang && (savedLang === 'tr' || savedLang === 'en')) {
      setLanguage(savedLang)
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'tr' ? 'en' : 'tr'
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const t = (key) => getTranslation(language, key)

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
