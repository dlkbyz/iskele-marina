import { NextResponse } from 'next/server'

export async function POST(request) {
  const response = NextResponse.json({
    success: true,
    message: 'Çıkış başarılı'
  })

  // Cookie'yi sil
  response.cookies.delete('admin_session')

  return response
}
