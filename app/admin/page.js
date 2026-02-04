'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Admin root sayfasına gelenleri otomatik olarak dashboard'a yönlendir
    router.push('/admin/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
        <p className="text-xl">Yönlendiriliyor...</p>
      </div>
    </div>
  )
}
