export const dynamic = 'force-static'

export default function OpengraphImage() {
  return new Response(
    `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#grad)"/>
      <text x="600" y="280" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">
        Serenity İskele
      </text>
      <text x="600" y="350" font-family="Arial, sans-serif" font-size="36" fill="white" opacity="0.9" text-anchor="middle">
        White Residence
      </text>
      <text x="600" y="420" font-family="Arial, sans-serif" font-size="28" fill="white" opacity="0.8" text-anchor="middle">
        Kuzey Kıbrıs'ta Lüks Tatil Evi
      </text>
    </svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  )
}
