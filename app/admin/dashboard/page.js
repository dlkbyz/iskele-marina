'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Droplet, LayoutGrid, CalendarCheck, Calendar, Tag, BarChart3,
  MessageCircle, Star, Mail, Image as ImageIcon, Sun, Moon, LogOut,
  Search, Bell, Hourglass, TrendingUp, BedDouble, Clock, ArrowUpRight,
  Check, X, ArrowLeft, ListFilter, Plus, Ellipsis, ChevronLeft, ChevronRight,
  Pencil, Trash2, Sparkles, Users, Save, ChevronUp, ChevronDown, ArrowUpDown,
  Reply, MailOpen, Phone, Inbox, Download, Power, UserPlus, AtSign,
  Upload, GripVertical,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import DatePickerTR from '../../components/DatePickerTR'

/* ============================================================ */
/* HELPERS                                                       */
/* ============================================================ */
function formatTL(n) {
  if (n === null || n === undefined) return '₺0'
  const v = Math.round(n)
  return '₺' + v.toLocaleString('tr-TR')
}
const greeting = () => {
  const h = new Date().getHours()
  return h < 6 ? 'İyi geceler' : h < 12 ? 'İyi sabahlar' : h < 18 ? 'İyi günler' : 'İyi akşamlar'
}
function timeAgo(d) {
  const sec = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000))
  if (sec < 60)    return 'az önce'
  if (sec < 3600)  return `${Math.floor(sec / 60)} dk önce`
  if (sec < 86400) return `${Math.floor(sec / 3600)} saat önce`
  if (sec < 604800) return `${Math.floor(sec / 86400)} gün önce`
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
}

/* ============================================================ */
/* SIDEBAR                                                       */
/* ============================================================ */
function Sidebar({ activeTab, setActiveTab, isDark, setIsDark, badges, onLogout }) {
  const groups = [
    {
      label: 'Operasyon',
      items: [
        { id: 'dashboard',      Icon: LayoutGrid,    label: 'Dashboard'      },
        { id: 'rezervasyonlar', Icon: CalendarCheck, label: 'Rezervasyonlar', badge: badges.rez },
        { id: 'takvim',         Icon: Calendar,      label: 'Takvim'         },
        { id: 'fiyatlandirma',  Icon: Tag,           label: 'Fiyatlandırma'  },
      ],
    },
    {
      label: 'İçerik & İletişim',
      items: [
        { id: 'istatistikler', Icon: BarChart3,     label: 'İstatistikler' },
        { id: 'mesajlar',      Icon: MessageCircle, label: 'Mesajlar',      badge: badges.msg },
        { id: 'yorumlar',      Icon: Star,          label: 'Yorumlar',      badge: badges.yor },
        { id: 'newsletter',    Icon: Mail,          label: 'Newsletter',    badge: badges.nl  },
        { id: 'galeri',        Icon: ImageIcon,     label: 'Galeri',        badge: badges.gal },
      ],
    },
  ]

  return (
    <aside className={`fixed left-0 top-0 h-full w-60 border-r flex flex-col ${isDark ? 'bg-sea-900 border-gold-500/10' : 'bg-cream border-gold-300/30'}`}>
      {/* Logo */}
      <div className={`px-4 py-5 border-b ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
            <Droplet className="w-5 h-5 text-gold-300" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className={`font-display text-xl font-light tracking-wide leading-none ${isDark ? 'text-cream' : 'text-sea-900'}`}>
              Serenity
            </h1>
            <p className={`text-[9px] tracking-[0.28em] uppercase mt-1 font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>
              İskele · Marina
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 pt-3 pb-3 space-y-0.5 overflow-y-auto">
        {groups.map((g) => (
          <div key={g.label}>
            <div className={`px-3 pt-5 pb-2 text-[9px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/55' : 'text-gold-600/70'}`}>
              {g.label}
            </div>
            {g.items.map((item) => {
              const isActive = activeTab === item.id
              const Icon = item.Icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                    isActive
                      ? (isDark ? 'bg-sea-800/60 text-cream' : 'bg-gold-50 text-sea-900')
                      : (isDark ? 'text-cream/65 hover:bg-sea-800/40 hover:text-cream' : 'text-mute hover:bg-sand-50 hover:text-sea-900')
                  }`}
                >
                  {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-gold-500" />}
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? (isDark ? 'text-gold-300' : 'text-gold-700') : (isDark ? 'text-cream/55' : 'text-mute')}`} strokeWidth={isActive ? 2 : 1.7} />
                  <span className={`text-sm flex-1 text-left tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                  {item.badge > 0 && (
                    <span className={`min-w-[22px] h-5 px-1.5 inline-flex items-center justify-center rounded-full text-[11px] font-semibold tabular-nums ${
                      isActive ? 'bg-gold-500 text-sea-900' : (isDark ? 'bg-sea-800 text-cream/75 border border-gold-500/10' : 'bg-sand-200 text-mute')
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={`px-3 pb-3 pt-2 border-t ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'} space-y-2`}>
        <button onClick={() => setIsDark(!isDark)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${isDark ? 'text-cream/65 hover:bg-sea-800/40 hover:text-cream' : 'text-mute hover:bg-sand-50 hover:text-sea-900'}`}>
          {isDark ? <Sun className="w-[18px] h-[18px]" strokeWidth={1.7} /> : <Moon className="w-[18px] h-[18px]" strokeWidth={1.7} />}
          <span className="text-sm font-medium tracking-tight">{isDark ? 'Aydınlık tema' : 'Karanlık tema'}</span>
        </button>
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${isDark ? 'bg-sea-800/40 border border-gold-500/10' : 'bg-sand-50 border border-gold-300/30'}`}>
          <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold text-sea-900 tracking-wider">NK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold leading-tight truncate ${isDark ? 'text-cream' : 'text-sea-900'}`}>Nazlı Kaya</p>
            <p className={`text-[10px] leading-tight mt-0.5 ${isDark ? 'text-cream/55' : 'text-mute'}`}>Ev sahibi</p>
          </div>
          <button onClick={onLogout} aria-label="Çıkış" className={`w-7 h-7 rounded-md flex items-center justify-center ${isDark ? 'text-cream/55 hover:text-rose-300 hover:bg-rose-500/10' : 'text-mute hover:text-rose-600 hover:bg-rose-50'}`}>
            <LogOut className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  )
}

/* ============================================================ */
/* TOP BAR                                                       */
/* ============================================================ */
function TopBar({ isDark, pageTitle, pendingCount, unreadCount, onPendingClick }) {
  return (
    <header className={`sticky top-0 z-30 backdrop-blur-xl border-b ${isDark ? 'bg-sea-900/85 border-gold-500/10' : 'bg-cream/90 border-gold-300/30'}`}>
      <div className="px-6 py-3.5 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>
            {new Date().toLocaleDateString('tr-TR', { weekday: 'long' })} · {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h2 className={`text-xl font-semibold mt-0.5 ${isDark ? 'text-cream' : 'text-sea-900'}`}>{pageTitle}</h2>
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <div className={`relative flex items-center rounded-lg border ${isDark ? 'bg-sea-800/40 border-gold-500/15' : 'bg-sand-50 border-gold-300/40'}`}>
            <Search className={`w-4 h-4 ml-3 ${isDark ? 'text-cream/45' : 'text-mute'}`} strokeWidth={1.8} />
            <input type="search" placeholder="Misafir, rezervasyon ara…" className={`flex-1 px-3 py-2 text-sm bg-transparent outline-none ${isDark ? 'text-cream placeholder-cream/45' : 'text-sea-900 placeholder-mute'}`} />
            <span className={`mr-2 px-1.5 py-0.5 text-[10px] font-semibold rounded border ${isDark ? 'border-gold-500/20 text-cream/55 bg-sea-900/60' : 'border-gold-300/40 text-mute bg-cream'}`}>⌘K</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button type="button" onClick={onPendingClick} className={`inline-flex items-center gap-2 pl-2.5 pr-3 py-2 rounded-lg text-[11px] font-semibold tracking-wide transition ${pendingCount > 0 ? 'bg-gold-500 hover:bg-gold-300 text-sea-900' : (isDark ? 'bg-sea-800/60 text-cream/65 border border-gold-500/15' : 'bg-sand-50 text-mute border border-gold-300/40')}`}>
            <Hourglass className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="tabular-nums">{pendingCount}</span>
            <span className="lowercase opacity-90">bekleyen</span>
          </button>
          <button type="button" aria-label="Bildirimler" className={`relative w-9 h-9 rounded-lg border flex items-center justify-center ${isDark ? 'border-gold-500/15 bg-sea-800/40 text-cream/75' : 'border-gold-300/40 bg-sand-50 text-sea-900'}`}>
            <Bell className="w-4 h-4" strokeWidth={1.8} />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-400" />}
          </button>
        </div>
      </div>
    </header>
  )
}

/* ============================================================ */
/* DASHBOARD HOME                                                */
/* ============================================================ */
function DashboardHome({ isDark, rezervasyonlar, mesajlar, monthlyData, occupancyData, statusData, upcomingList, activityFeed, onApprove, onReject, quickActionLoading, onAllPending, onOpenCalendar }) {
  const bekleyen = rezervasyonlar.filter(r => r.durum === 'beklemede')
  const onaylanan = rezervasyonlar.filter(r => r.durum === 'onaylandi' || r.durum === 'onaylandı')
  const yarinKi = rezervasyonlar.filter(r => new Date(r.giris_tarihi) > new Date()).sort((a,b) => new Date(a.giris_tarihi) - new Date(b.giris_tarihi))[0]
  const daysAway = yarinKi ? Math.ceil((new Date(yarinKi.giris_tarihi) - new Date()) / 86400000) : null
  const unread = mesajlar.filter(m => !m.okundu).length

  const buAyGelir = rezervasyonlar
    .filter(r => (r.durum === 'onaylandi' || r.durum === 'onaylandı') && new Date(r.created_at || r.giris_tarihi).getMonth() === new Date().getMonth())
    .reduce((s, r) => s + (r.toplam_fiyat || 0), 0)
  const onayOrani = rezervasyonlar.length ? Math.round((onaylanan.length / rezervasyonlar.length) * 100) : 0
  const ortGecelik = (() => {
    if (!onaylanan.length) return 0
    const nights = onaylanan.reduce((s, r) => s + Math.max(1, Math.ceil((new Date(r.cikis_tarihi) - new Date(r.giris_tarihi))/86400000)), 0)
    const rev = onaylanan.reduce((s, r) => s + (r.toplam_fiyat || 0), 0)
    return nights ? Math.round(rev / nights) : 0
  })()
  const buAy = new Date().toLocaleDateString('tr-TR', { month: 'long' }).toUpperCase()

  const kpis = [
    { Icon: TrendingUp, label: 'Bu ay geliri',   value: formatTL(buAyGelir), tag: buAy,    delta: '+%16.3', dnote: 'geçen aya göre' },
    { Icon: BedDouble,  label: 'Doluluk oranı',  value: '88%',                tag: 'BU AY', delta: '+3 pt',  dnote: 'geçen aya göre' },
    { Icon: Tag,        label: 'Ort. gecelik',   value: formatTL(ortGecelik), tag: 'ADR',   delta: '+%5.2',  dnote: 'geçen aya göre' },
    { Icon: Clock,      label: 'Bekleyen talep', value: bekleyen.length,      tag: 'İŞLEM', delta: null,     dnote: `${bekleyen.length} onay bekliyor` },
  ]

  return (
    <div className="space-y-3">
      {/* Hero greeting */}
      <section className={`${isDark ? 'bg-sea-900/40 border-gold-500/10' : 'bg-cream border-gold-300/30'} border rounded-xl p-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6`}>
        <div>
          <h1 className={`font-display text-3xl md:text-4xl font-light tracking-tight ${isDark ? 'text-cream' : 'text-sea-900'}`}>
            {greeting()}, <em className="font-display italic text-gold-300">Nazlı</em>
          </h1>
          <div className={`mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] ${isDark ? 'text-cream/65' : 'text-mute'}`}>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Daire bugün müsait
            </span>
            <span className={isDark ? 'text-cream/30' : 'text-mute/50'}>·</span>
            {yarinKi ? <span>Sıradaki giriş {daysAway} gün sonra – {yarinKi.ad} {yarinKi.soyad}</span> : <span>Yaklaşan giriş yok</span>}
            <span className={isDark ? 'text-cream/30' : 'text-mute/50'}>·</span>
            <span>{bekleyen.length} talep onayını bekliyor</span>
          </div>
        </div>
        <div className="flex items-stretch gap-2">
          {[
            { label: 'Açık Talep', value: bekleyen.length },
            { label: 'Yeni Mesaj', value: unread },
            { label: 'Doluluk',    value: '%88' },
          ].map((m, i) => (
            <div key={i} className={`px-4 py-2.5 rounded-lg border min-w-[88px] ${isDark ? 'bg-sea-800/40 border-gold-500/10' : 'bg-sand-50 border-gold-300/30'}`}>
              <p className={`text-[9px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>{m.label}</p>
              <p className={`text-xl font-semibold tabular-nums mt-1 ${isDark ? 'text-cream' : 'text-sea-900'}`}>{m.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4 KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(({ Icon, label, value, tag, delta, dnote }, i) => (
          <div key={i} className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-sea-800 border border-gold-500/15' : 'bg-sand-50 border border-gold-300/40'}`}>
                <Icon className={`w-4 h-4 ${isDark ? 'text-gold-300' : 'text-gold-700'}`} strokeWidth={1.8} />
              </div>
              <span className={`text-[9px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-cream/45' : 'text-mute'}`}>{tag}</span>
            </div>
            <p className={`text-[11px] font-medium mb-1 ${isDark ? 'text-cream/65' : 'text-mute'}`}>{label}</p>
            <p className={`text-2xl md:text-[26px] font-semibold tabular-nums tracking-tight mb-2 ${isDark ? 'text-cream' : 'text-sea-900'}`}>{value}</p>
            <div className="flex items-center gap-1.5">
              {delta && <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-400"><TrendingUp className="w-3 h-3" strokeWidth={2.2} />{delta}</span>}
              <span className={`text-[11px] ${isDark ? 'text-cream/45' : 'text-mute'}`}>{dnote}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Chart */}
        <div className={`lg:col-span-2 ${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="block h-px w-5 bg-gold-500/60" />
              <div>
                <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Trend</p>
                <h3 className={`text-base font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Gelir Analizi</h3>
              </div>
            </div>
            <div className={`inline-flex p-0.5 rounded-lg border ${isDark ? 'bg-sea-800/40 border-gold-500/15' : 'bg-sand-50 border-gold-300/40'}`}>
              {['3 ay', '6 ay', '12 ay'].map((p, i) => (
                <button key={p} type="button" className={`px-3 py-1 text-[11px] font-semibold rounded-md ${i === 1 ? (isDark ? 'bg-sea-700 text-cream' : 'bg-cream text-sea-900 shadow-sm') : (isDark ? 'text-cream/55' : 'text-mute')}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C99060" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#C99060" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(201,144,96,0.1)' : '#EBDFC4'} vertical={false} />
                <XAxis dataKey="ay" stroke={isDark ? 'rgba(248,245,238,0.5)' : '#6b6b6b'} style={{ fontSize: '11px' }} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? 'rgba(248,245,238,0.5)' : '#6b6b6b'} style={{ fontSize: '11px' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: isDark ? '#154A42' : '#fff', border: isDark ? '1px solid rgba(201,144,96,0.25)' : '1px solid #DDCBA5', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: isDark ? '#F4EEDF' : '#1A1A1A', fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: isDark ? '#F4EEDF' : '#1A1A1A' }}
                />
                <Area type="monotone" dataKey="rezervasyon" stroke="#C99060" strokeWidth={2} fill="url(#goldArea)" dot={false} activeDot={{ r: 4, fill: '#D9A87C' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'} flex items-center justify-between text-[11px]`}>
            <span className={`inline-flex items-center gap-2 ${isDark ? 'text-cream/65' : 'text-mute'}`}>
              <span className="w-2 h-0.5 bg-gold-500 rounded-full" /> Aylık gelir (₺)
            </span>
            <span className={isDark ? 'text-cream/55' : 'text-mute'}>
              Toplam <span className={`tabular-nums font-semibold ml-1 ${isDark ? 'text-cream' : 'text-sea-900'}`}>{formatTL(onaylanan.reduce((s, r) => s + (r.toplam_fiyat || 0), 0))}</span>
            </span>
          </div>
        </div>

        {/* Pending */}
        <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="block h-px w-5 bg-gold-500/60" />
              <div>
                <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Onay Bekliyor</p>
                <h3 className={`text-base font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Son Talepler</h3>
              </div>
            </div>
            <button type="button" onClick={onAllPending} className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-md px-2 py-1 ${isDark ? 'text-cream/65 hover:bg-sea-800/50' : 'text-mute hover:bg-sand-50'}`}>
              Tümü
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
          </div>
          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
            {bekleyen.slice(0, 6).map((r) => {
              const giris = new Date(r.giris_tarihi)
              const cikis = new Date(r.cikis_tarihi)
              const initials = `${(r.ad || '?')[0]}${(r.soyad || '?')[0]}`.toUpperCase()
              const range = `${giris.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })} — ${cikis.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}`
              return (
                <div key={r.id} className={`${isDark ? 'bg-sea-800/30 border-gold-500/10' : 'bg-sand-50 border-gold-300/30'} border rounded-lg p-3`}>
                  <div className="flex items-start gap-3 mb-2.5">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold ${isDark ? 'bg-sea-700 text-cream/85' : 'bg-gold-500/15 text-gold-700'}`}>
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-semibold text-sm truncate ${isDark ? 'text-cream' : 'text-sea-900'}`}>{r.ad} {r.soyad}</h4>
                        <span className={`tabular-nums font-semibold text-sm ${isDark ? 'text-cream' : 'text-sea-900'}`}>{formatTL(r.toplam_fiyat)}</span>
                      </div>
                      <div className={`flex items-center gap-2 mt-0.5 text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" strokeWidth={1.8} />{range}</span>
                        <span>·</span>
                        <span>{r.kisi_sayisi} kişi</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => onApprove(r)} disabled={quickActionLoading === r.id} className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-semibold border disabled:opacity-50 ${isDark ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                      <Check className="w-3.5 h-3.5" strokeWidth={2.2} />
                      {quickActionLoading === r.id ? '…' : 'Onayla'}
                    </button>
                    <button onClick={() => onReject(r)} disabled={quickActionLoading === r.id} className={`flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-semibold border disabled:opacity-50 ${isDark ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'}`}>
                      <X className="w-3.5 h-3.5" strokeWidth={2.2} />
                      {quickActionLoading === r.id ? '…' : 'Reddet'}
                    </button>
                  </div>
                </div>
              )
            })}
            {bekleyen.length === 0 && (
              <div className={`text-center py-10 text-sm ${isDark ? 'text-cream/55' : 'text-mute'}`}>Bekleyen talep yok</div>
            )}
          </div>
        </div>
      </div>

      {/* === Performans (bar) + Rezervasyon Durumu (donut) === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Performans */}
        <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="block h-px w-5 bg-gold-500/60" />
              <div>
                <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Performans</p>
                <h3 className={`text-base font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Aylık Doluluk Oranı</h3>
              </div>
            </div>
            <span className={`text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>
              Sezonluk talep · <span className={`tabular-nums font-semibold ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>%{occupancyData[occupancyData.length - 1]?.oran || 0} bu ay</span>
            </span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(201,144,96,0.08)' : '#EBDFC4'} vertical={false} />
                <XAxis dataKey="ay" stroke={isDark ? 'rgba(248,245,238,0.5)' : '#6b6b6b'} style={{ fontSize: '11px' }} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? 'rgba(248,245,238,0.5)' : '#6b6b6b'} style={{ fontSize: '11px' }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: isDark ? '#154A42' : '#fff', border: isDark ? '1px solid rgba(201,144,96,0.25)' : '1px solid #DDCBA5', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: isDark ? '#F4EEDF' : '#1A1A1A', fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: isDark ? '#F4EEDF' : '#1A1A1A' }}
                  cursor={{ fill: isDark ? 'rgba(248,245,238,0.05)' : 'rgba(19,64,59,0.04)' }}
                />
                <Bar dataKey="oran" radius={[6, 6, 0, 0]}>
                  {occupancyData.map((_, idx) => (
                    <Cell key={`bar-${idx}`} fill={idx === occupancyData.length - 1 ? '#C99060' : (isDark ? '#3F756B' : '#82AFA3')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rezervasyon Durumu */}
        <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="block h-px w-5 bg-gold-500/60" />
              <div>
                <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Son 90 Gün</p>
                <h3 className={`text-base font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Rezervasyon Durumu</h3>
              </div>
            </div>
          </div>
          {(() => {
            const total = statusData.reduce((s, x) => s + x.value, 0)
            const pct = (v) => total ? Math.round((v / total) * 100) : 0
            return (
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="h-[220px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData.filter(s => s.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={88} paddingAngle={2} dataKey="value" stroke="none">
                        {statusData.filter(s => s.value > 0).map((s, idx) => <Cell key={idx} fill={s.color} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: isDark ? '#154A42' : '#fff', border: isDark ? '1px solid rgba(201,144,96,0.25)' : '1px solid #DDCBA5', borderRadius: '8px', fontSize: '12px' }}
                        labelStyle={{ color: isDark ? '#F4EEDF' : '#1A1A1A', fontWeight: 600, marginBottom: 4 }}
                        itemStyle={{ color: isDark ? '#F4EEDF' : '#1A1A1A' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className={`text-3xl font-semibold tabular-nums ${isDark ? 'text-cream' : 'text-sea-900'}`}>{total}</p>
                    <p className={`text-[9px] tracking-[0.28em] uppercase font-semibold mt-0.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Rezervasyon</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {statusData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="inline-flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className={`truncate ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>{s.name}</span>
                      </span>
                      <span className="flex items-center gap-3 shrink-0">
                        <span className={`tabular-nums font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>{s.value}</span>
                        <span className={`tabular-nums w-9 text-right ${isDark ? 'text-cream/55' : 'text-mute'}`}>%{pct(s.value)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* === Yaklaşan Girişler + Aktivite Akışı === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Yaklaşan Girişler */}
        <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="block h-px w-5 bg-gold-500/60" />
              <div>
                <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Takvim</p>
                <h3 className={`text-base font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Yaklaşan Girişler</h3>
              </div>
            </div>
            <button type="button" onClick={onOpenCalendar} className={`inline-flex items-center gap-1 text-[11px] font-semibold rounded-md px-2 py-1 border ${isDark ? 'border-gold-500/20 text-cream/85 hover:bg-sea-800/50' : 'border-gold-300/40 text-sea-900 hover:bg-sand-50'}`}>
              Takvimi aç
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.8} />
            </button>
          </div>
          {upcomingList.length === 0 ? (
            <div className={`text-center py-8 text-sm ${isDark ? 'text-cream/55' : 'text-mute'}`}>Yaklaşan giriş yok</div>
          ) : (
            <div className="space-y-1">
              {upcomingList.map((r) => {
                const d = new Date(r.giris_tarihi)
                const days = Math.ceil((d - new Date()) / 86400000)
                const nights = Math.max(1, Math.ceil((new Date(r.cikis_tarihi) - d) / 86400000))
                return (
                  <div key={r.id} className={`flex items-center gap-3 py-2.5 border-b last:border-0 ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'}`}>
                    <div className="text-center shrink-0 w-12">
                      <p className={`font-display text-xl font-semibold tabular-nums leading-none ${isDark ? 'text-cream' : 'text-sea-900'}`}>
                        {d.getDate().toString().padStart(2, '0')}
                      </p>
                      <p className={`text-[9px] tracking-[0.22em] uppercase font-semibold mt-1 ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>
                        {d.toLocaleDateString('tr-TR', { month: 'short' }).replace('.', '').toUpperCase()}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isDark ? 'text-cream' : 'text-sea-900'}`}>{r.ad} {r.soyad}</p>
                      <p className={`text-[11px] mt-0.5 ${isDark ? 'text-cream/55' : 'text-mute'}`}>{nights} gece · {r.kisi_sayisi} misafir</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider border ${isDark ? 'bg-sea-800/60 text-cream/75 border-gold-500/10' : 'bg-sand-50 text-mute border-gold-300/40'}`}>
                      {days} gün sonra
                    </span>
                    <span className={`shrink-0 tabular-nums font-semibold text-sm ${isDark ? 'text-cream' : 'text-sea-900'}`}>
                      {formatTL(r.toplam_fiyat)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Aktivite Akışı */}
        <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="block h-px w-5 bg-gold-500/60" />
              <div>
                <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Günün Nabzı</p>
                <h3 className={`text-base font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Aktivite Akışı</h3>
              </div>
            </div>
          </div>
          {activityFeed.length === 0 ? (
            <div className={`text-center py-10 text-sm ${isDark ? 'text-cream/55' : 'text-mute'}`}>Henüz aktivite yok</div>
          ) : (
            <ul className="space-y-3">
              {activityFeed.map((ev) => {
                const tone = ev.tone
                const Icon = ev.Icon
                return (
                  <li key={ev.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                      tone === 'amber'   ? 'bg-amber-500/15 border-amber-400/30'     :
                      tone === 'emerald' ? 'bg-emerald-500/15 border-emerald-400/30' :
                      tone === 'rose'    ? 'bg-rose-500/15 border-rose-400/30'       :
                      tone === 'gold'    ? 'bg-gold-500/15 border-gold-500/30'       :
                                           (isDark ? 'bg-sea-800 border-gold-500/15' : 'bg-sand-50 border-gold-300/40')
                    }`}>
                      <Icon className={`w-3.5 h-3.5 ${
                        tone === 'amber'   ? 'text-amber-300'   :
                        tone === 'emerald' ? 'text-emerald-300' :
                        tone === 'rose'    ? 'text-rose-300'    :
                        tone === 'gold'    ? 'text-gold-300'    :
                                             (isDark ? 'text-cream/65' : 'text-mute')
                      }`} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-[13px] font-semibold leading-tight ${isDark ? 'text-cream' : 'text-sea-900'}`}>
                          {ev.title}
                        </p>
                        <span className={`text-[11px] tabular-nums shrink-0 ${isDark ? 'text-cream/45' : 'text-mute'}`}>
                          {timeAgo(ev.at)}
                        </span>
                      </div>
                      <p className={`text-[12px] mt-0.5 truncate ${isDark ? 'text-cream/65' : 'text-mute'}`}>
                        {ev.detail}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================================ */
/* RESERVATIONS TAB                                              */
/* ============================================================ */
function Reservations({ isDark, rezervasyonlar, onApprove, onReject, quickActionLoading }) {
  const [filter, setFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  /* Sıralama */
  const [sortField, setSortField] = useState('created_at')  // 'giris' | 'durum' | 'created_at'
  const [sortDir, setSortDir] = useState('desc')             // 'asc' | 'desc'
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  /* Gelişmiş filtre paneli */
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [advGirisFrom, setAdvGirisFrom] = useState('')
  const [advGirisTo, setAdvGirisTo] = useState('')
  const [advMinTutar, setAdvMinTutar] = useState('')
  const [advMaxTutar, setAdvMaxTutar] = useState('')
  const advActive = advGirisFrom || advGirisTo || advMinTutar || advMaxTutar
  const clearAdvFilters = () => {
    setAdvGirisFrom(''); setAdvGirisTo(''); setAdvMinTutar(''); setAdvMaxTutar('')
  }

  /* Filtre değişince sayfa 1'e dön */
  useEffect(() => { setCurrentPage(1) }, [filter, sortField, sortDir, advGirisFrom, advGirisTo, advMinTutar, advMaxTutar])

  const matches = (r, f) => {
    if (f === 'all')       return true
    if (f === 'beklemede') return r.durum === 'beklemede'
    if (f === 'onaylandi') return r.durum === 'onaylandi' || r.durum === 'onaylandı'
    if (f === 'reddedildi') return r.durum === 'reddedildi'
    if (f === 'iptal')     return r.durum === 'iptal' || r.durum === 'iptal_edildi'
    return true
  }
  const counts = {
    all:        rezervasyonlar.length,
    beklemede:  rezervasyonlar.filter(r => matches(r, 'beklemede')).length,
    onaylandi:  rezervasyonlar.filter(r => matches(r, 'onaylandi')).length,
    reddedildi: rezervasyonlar.filter(r => matches(r, 'reddedildi')).length,
    iptal:      rezervasyonlar.filter(r => matches(r, 'iptal')).length,
  }
  /* Durum sıralama önceliği */
  const durumPri = (r) => {
    if (r.durum === 'beklemede') return 1
    if (r.durum === 'onaylandi' || r.durum === 'onaylandı') return 2
    if (r.durum === 'reddedildi') return 3
    if (r.durum === 'iptal' || r.durum === 'iptal_edildi') return 4
    return 5
  }

  const filtered = rezervasyonlar
    .filter(r => matches(r, filter))
    .filter(r => {
      // Gelişmiş tarih aralığı (giriş tarihi)
      if (advGirisFrom && new Date(r.giris_tarihi) < new Date(advGirisFrom)) return false
      if (advGirisTo && new Date(r.giris_tarihi) > new Date(advGirisTo)) return false
      // Gelişmiş tutar
      const tutar = r.toplam_fiyat || 0
      if (advMinTutar && tutar < +advMinTutar) return false
      if (advMaxTutar && tutar > +advMaxTutar) return false
      return true
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortField === 'giris') {
        return dir * (new Date(a.giris_tarihi) - new Date(b.giris_tarihi))
      }
      if (sortField === 'durum') {
        return dir * (durumPri(a) - durumPri(b))
      }
      // created_at varsayılan
      return dir * (new Date(a.created_at || a.giris_tarihi) - new Date(b.created_at || b.giris_tarihi))
    })

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * itemsPerPage
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage)
  const showingFrom = filtered.length === 0 ? 0 : startIdx + 1
  const showingTo = Math.min(startIdx + itemsPerPage, filtered.length)

  const chips = [
    { id: 'all',        label: 'Tümü' },
    { id: 'beklemede',  label: 'Beklemede' },
    { id: 'onaylandi',  label: 'Onaylandı' },
    { id: 'reddedildi', label: 'Reddedildi' },
    { id: 'iptal',      label: 'İptal' },
  ]

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {chips.map((c) => {
            const active = filter === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-tight transition border ${
                  active
                    ? (isDark ? 'bg-sea-800 text-cream border-gold-500/40' : 'bg-sea-900 text-cream border-sea-900')
                    : (isDark ? 'border-gold-500/15 text-cream/65 hover:border-gold-500/40 hover:text-cream' : 'border-gold-300/40 text-mute hover:border-gold-500 hover:text-sea-900')
                }`}
              >
                {c.label}
                <span className={`tabular-nums ${active ? 'opacity-85' : 'opacity-65'}`}>{counts[c.id] || 0}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterPanelOpen(o => !o)}
            className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold border transition ${
              filterPanelOpen || advActive
                ? 'bg-gold-500/15 border-gold-500/40 text-gold-300'
                : (isDark ? 'border-gold-500/15 text-cream/85 bg-sea-800/40 hover:border-gold-500/40' : 'border-gold-300/40 text-sea-900 bg-cream hover:border-gold-500')
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" strokeWidth={1.8} />
            Filtrele
            {advActive && (
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gold-500 text-sea-900 text-[9px] font-bold">
                {[advGirisFrom, advGirisTo, advMinTutar, advMaxTutar].filter(Boolean).length}
              </span>
            )}
          </button>
          <button type="button" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold bg-gold-500 hover:bg-gold-300 text-sea-900 transition">
            <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
            Rezervasyon ekle
          </button>
        </div>
      </div>

      {/* Filtre paneli */}
      {filterPanelOpen && (
        <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3`}>
          <div>
            <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Giriş — başlangıç</label>
            <DatePickerTR
              value={advGirisFrom}
              onChange={setAdvGirisFrom}
              placeholder="gg/aa/yyyy"
              className="w-full"
              inputClassName={`w-full px-3 py-1.5 rounded-md border text-xs outline-none cursor-pointer ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream placeholder-cream/40' : 'bg-sand-50 border-gold-300/40 text-sea-900 placeholder-mute'}`}
            />
          </div>
          <div>
            <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Giriş — bitiş</label>
            <DatePickerTR
              value={advGirisTo}
              onChange={setAdvGirisTo}
              minDate={advGirisFrom}
              placeholder="gg/aa/yyyy"
              className="w-full"
              inputClassName={`w-full px-3 py-1.5 rounded-md border text-xs outline-none cursor-pointer ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream placeholder-cream/40' : 'bg-sand-50 border-gold-300/40 text-sea-900 placeholder-mute'}`}
            />
          </div>
          <div>
            <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Min tutar (₺)</label>
            <input
              type="number"
              value={advMinTutar}
              onChange={(e) => setAdvMinTutar(e.target.value)}
              placeholder="0"
              className={`w-full px-3 py-1.5 rounded-md border text-xs tabular-nums outline-none ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream placeholder-cream/40' : 'bg-sand-50 border-gold-300/40 text-sea-900 placeholder-mute'}`}
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Max tutar (₺)</label>
              <input
                type="number"
                value={advMaxTutar}
                onChange={(e) => setAdvMaxTutar(e.target.value)}
                placeholder="—"
                className={`w-full px-3 py-1.5 rounded-md border text-xs tabular-nums outline-none ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream placeholder-cream/40' : 'bg-sand-50 border-gold-300/40 text-sea-900 placeholder-mute'}`}
              />
            </div>
            {advActive && (
              <button
                type="button"
                onClick={clearAdvFilters}
                aria-label="Temizle"
                className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center border transition ${isDark ? 'border-gold-500/15 text-cream/65 hover:text-rose-300 hover:bg-rose-500/10' : 'border-gold-300/40 text-mute hover:text-rose-600 hover:bg-rose-50'}`}
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl overflow-hidden`}>
        {/* Header */}
        <div className={`grid grid-cols-12 gap-3 px-5 py-3 text-[10px] tracking-[0.22em] uppercase font-semibold border-b ${isDark ? 'text-gold-300/70 border-gold-500/15' : 'text-gold-600/80 border-gold-300/30'}`}>
          <div className="col-span-4">Misafir</div>
          <button
            type="button"
            onClick={() => toggleSort('giris')}
            className={`col-span-2 flex items-center gap-1 text-left transition ${isDark ? 'hover:text-cream' : 'hover:text-sea-900'}`}
          >
            Giriş — Çıkış
            {sortField === 'giris'
              ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" strokeWidth={2.5} /> : <ChevronDown className="w-3 h-3" strokeWidth={2.5} />)
              : <ArrowUpDown className="w-3 h-3 opacity-40" strokeWidth={2} />}
          </button>
          <div className="col-span-1">Gece</div>
          <div className="col-span-2">Tutar</div>
          <button
            type="button"
            onClick={() => toggleSort('durum')}
            className={`col-span-2 flex items-center gap-1 text-left transition ${isDark ? 'hover:text-cream' : 'hover:text-sea-900'}`}
          >
            Durum
            {sortField === 'durum'
              ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" strokeWidth={2.5} /> : <ChevronDown className="w-3 h-3" strokeWidth={2.5} />)
              : <ArrowUpDown className="w-3 h-3 opacity-40" strokeWidth={2} />}
          </button>
          <div className="col-span-1 text-right">İşlem</div>
        </div>
        {/* Rows */}
        {filtered.length === 0 ? (
          <div className={`px-5 py-14 text-center text-sm ${isDark ? 'text-cream/55' : 'text-mute'}`}>Bu filtrede rezervasyon yok</div>
        ) : (
          paginated.map((r) => {
            const giris = new Date(r.giris_tarihi)
            const cikis = new Date(r.cikis_tarihi)
            const initials = `${(r.ad || '?')[0]}${(r.soyad || '?')[0]}`.toUpperCase()
            const nights = Math.max(1, Math.ceil((cikis - giris) / 86400000))
            const range = `${giris.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })} — ${cikis.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}`
            const relTime = timeAgo(new Date(r.created_at || r.giris_tarihi))
            const pending = r.durum === 'beklemede'
            const approved = r.durum === 'onaylandi' || r.durum === 'onaylandı'
            const rejected = r.durum === 'reddedildi'
            const cancelled = r.durum === 'iptal' || r.durum === 'iptal_edildi'

            return (
              <div key={r.id} className={`grid grid-cols-12 gap-3 px-5 py-3 items-center border-b transition last:border-0 ${isDark ? 'border-gold-500/10 hover:bg-sea-800/30' : 'border-gold-300/20 hover:bg-sand-50/60'}`}>
                {/* Misafir */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${isDark ? 'bg-gold-500/15 text-gold-300' : 'bg-gold-500/15 text-gold-700'}`}>
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-cream' : 'text-sea-900'}`}>{r.ad} {r.soyad}</p>
                    <p className={`text-[11px] truncate ${isDark ? 'text-cream/55' : 'text-mute'}`}>
                      RZ-{String(r.id).padStart(4, '0')}{r.email ? ' · ' + r.email : ''}
                    </p>
                  </div>
                </div>
                {/* Giriş-Çıkış */}
                <div className="col-span-2 min-w-0">
                  <p className={`text-sm ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>{range}</p>
                  <p className={`text-[11px] ${isDark ? 'text-cream/45' : 'text-mute'}`}>{relTime}</p>
                </div>
                {/* Gece */}
                <div className={`col-span-1 text-sm tabular-nums ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>{nights}</div>
                {/* Tutar */}
                <div className={`col-span-2 text-sm tabular-nums font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>{formatTL(r.toplam_fiyat)}</div>
                {/* Durum */}
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    pending   ? (isDark ? 'bg-amber-500/15 text-amber-300'   : 'bg-amber-100 text-amber-700') :
                    approved  ? (isDark ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-700') :
                    rejected  ? (isDark ? 'bg-rose-500/15 text-rose-300'    : 'bg-rose-100 text-rose-700') :
                    cancelled ? (isDark ? 'bg-cream/10 text-cream/65'        : 'bg-sand-200 text-mute') :
                                (isDark ? 'bg-sea-800 text-cream/65'         : 'bg-sand-50 text-mute')
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      pending   ? 'bg-amber-400'   :
                      approved  ? 'bg-emerald-400' :
                      rejected  ? 'bg-rose-400'    :
                      cancelled ? 'bg-cream/50'    : 'bg-cream/50'
                    }`} />
                    {pending ? 'Beklemede' : approved ? 'Onaylandı' : rejected ? 'Reddedildi' : cancelled ? 'İptal' : r.durum}
                  </span>
                </div>
                {/* İşlem */}
                <div className="col-span-1 flex items-center justify-end gap-1">
                  {pending ? (
                    <>
                      <button
                        onClick={() => onApprove(r)}
                        disabled={quickActionLoading === r.id}
                        aria-label="Onayla"
                        className={`w-7 h-7 rounded-md flex items-center justify-center border disabled:opacity-50 transition ${isDark ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </button>
                      <button
                        onClick={() => onReject(r)}
                        disabled={quickActionLoading === r.id}
                        aria-label="Reddet"
                        className={`w-7 h-7 rounded-md flex items-center justify-center border disabled:opacity-50 transition ${isDark ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'}`}
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      aria-label="Detay"
                      className={`w-7 h-7 rounded-md flex items-center justify-center transition ${isDark ? 'text-cream/55 hover:text-cream hover:bg-sea-800/50' : 'text-mute hover:text-sea-900 hover:bg-sand-50'}`}
                    >
                      <Ellipsis className="w-4 h-4" strokeWidth={1.8} />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}

        {/* Pagination footer */}
        {filtered.length > itemsPerPage && (
          <div className={`px-5 py-3 flex items-center justify-between border-t ${isDark ? 'border-gold-500/10 bg-sea-900/40' : 'border-gold-300/30 bg-sand-50/50'}`}>
            <p className={`text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>
              <span className="tabular-nums">{showingFrom}–{showingTo}</span> / <span className="tabular-nums">{filtered.length}</span> rezervasyon
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                disabled={safePage === 1}
                aria-label="Önceki sayfa"
                className={`w-7 h-7 rounded-md flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'border border-gold-500/15 text-cream/65 hover:bg-sea-800/50' : 'border border-gold-300/40 text-mute hover:bg-cream'}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.8} />
              </button>
              {(() => {
                // Sade sayfa numarası listesi: 1...current-1 current current+1...total
                const pages = []
                const maxButtons = 5
                let start = Math.max(1, safePage - Math.floor(maxButtons / 2))
                let end = Math.min(totalPages, start + maxButtons - 1)
                if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1)
                if (start > 1) {
                  pages.push(<button key="first" type="button" onClick={() => setCurrentPage(1)} className={`w-7 h-7 rounded-md text-[11px] font-semibold tabular-nums transition ${isDark ? 'text-cream/65 hover:bg-sea-800/50' : 'text-mute hover:bg-cream'}`}>1</button>)
                  if (start > 2) pages.push(<span key="dots1" className={`px-1 text-[11px] ${isDark ? 'text-cream/40' : 'text-mute'}`}>…</span>)
                }
                for (let p = start; p <= end; p++) {
                  const active = p === safePage
                  pages.push(
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded-md text-[11px] font-semibold tabular-nums transition ${
                        active
                          ? 'bg-gold-500 text-sea-900'
                          : (isDark ? 'text-cream/65 hover:bg-sea-800/50' : 'text-mute hover:bg-cream')
                      }`}
                    >
                      {p}
                    </button>
                  )
                }
                if (end < totalPages) {
                  if (end < totalPages - 1) pages.push(<span key="dots2" className={`px-1 text-[11px] ${isDark ? 'text-cream/40' : 'text-mute'}`}>…</span>)
                  pages.push(<button key="last" type="button" onClick={() => setCurrentPage(totalPages)} className={`w-7 h-7 rounded-md text-[11px] font-semibold tabular-nums transition ${isDark ? 'text-cream/65 hover:bg-sea-800/50' : 'text-mute hover:bg-cream'}`}>{totalPages}</button>)
                }
                return pages
              })()}
              <button
                type="button"
                onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
                disabled={safePage === totalPages}
                aria-label="Sonraki sayfa"
                className={`w-7 h-7 rounded-md flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'border border-gold-500/15 text-cream/65 hover:bg-sea-800/50' : 'border border-gold-300/40 text-mute hover:bg-cream'}`}
              >
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================================================ */
/* TAKVIM TAB                                                    */
/* ============================================================ */
function Takvim({ isDark, rezervasyonlar }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  /* Yardımcılar */
  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  /* Pzt başlangıçlı 6 haftalık grid */
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const offset = (firstDay.getDay() + 6) % 7   // Pazar=0 → 6, Pzt=1 → 0
    const start = new Date(year, month, 1 - offset)
    const days = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d)
    }
    return days
  }, [currentMonth])

  /* Rezervasyonu bul */
  const findReservation = (day) => {
    return rezervasyonlar.find((r) => {
      const giris = new Date(r.giris_tarihi)
      const cikis = new Date(r.cikis_tarihi)
      return day >= giris && day < cikis && (r.durum === 'onaylandi' || r.durum === 'onaylandı' || r.durum === 'beklemede')
    })
  }

  /* Ay istatistikleri */
  const monthStats = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const totalDays = new Date(year, month + 1, 0).getDate()
    let dolu = 0, onayli = 0, bekleyen = 0
    for (let d = 1; d <= totalDays; d++) {
      const day = new Date(year, month, d)
      const rez = findReservation(day)
      if (rez) {
        dolu++
        if (rez.durum === 'beklemede') bekleyen++
        else onayli++
      }
    }
    return {
      totalDays,
      dolu,
      bos: totalDays - dolu,
      onayli,
      bekleyen,
      occupancy: Math.round((dolu / totalDays) * 100),
    }
  }, [currentMonth, rezervasyonlar]) // eslint-disable-line react-hooks/exhaustive-deps

  const today = new Date()
  const monthLabel = currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })

  const kpis = [
    { label: 'Doluluk',            value: `%${monthStats.occupancy}`,         sub: `${monthStats.dolu}/${monthStats.totalDays} gün`, tone: 'gold'    },
    { label: 'Onaylı',              value: monthStats.onayli,                  sub: 'rezervasyon',                                     tone: 'emerald' },
    { label: 'Bekleyen',           value: monthStats.bekleyen,                sub: 'onay bekliyor',                                   tone: 'amber'   },
    { label: 'Boş Gün',            value: monthStats.bos,                     sub: 'müsait',                                          tone: 'sea'     },
  ]

  return (
    <div className="space-y-3">
      {/* Mini KPI'lar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>{k.label}</p>
              <span className={`w-2 h-2 rounded-full ${
                k.tone === 'gold' ? 'bg-gold-500' :
                k.tone === 'emerald' ? 'bg-emerald-400' :
                k.tone === 'amber' ? 'bg-amber-400' :
                                     'bg-sea-400'
              }`} />
            </div>
            <p className={`text-2xl font-semibold tabular-nums tracking-tight ${isDark ? 'text-cream' : 'text-sea-900'}`}>{k.value}</p>
            <p className={`text-[11px] mt-1 ${isDark ? 'text-cream/55' : 'text-mute'}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Takvim kartı */}
      <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Takvim</p>
            <h3 className={`font-display text-2xl font-light tracking-wide capitalize ${isDark ? 'text-cream' : 'text-sea-900'}`}>{monthLabel}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              aria-label="Önceki ay"
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${isDark ? 'border-gold-500/15 hover:bg-sea-800/50 text-cream/85' : 'border-gold-300/40 hover:bg-sand-50 text-sea-900'}`}
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date())}
              className="px-3.5 py-2 rounded-lg text-[10px] font-semibold tracking-wider uppercase bg-gold-500 hover:bg-gold-300 text-sea-900 transition"
            >
              Bugün
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
              aria-label="Sonraki ay"
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${isDark ? 'border-gold-500/15 hover:bg-sea-800/50 text-cream/85' : 'border-gold-300/40 hover:bg-sand-50 text-sea-900'}`}
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className={`flex flex-wrap items-center gap-5 px-4 py-3 mb-4 rounded-lg border ${isDark ? 'bg-sea-800/40 border-gold-500/10' : 'bg-sand-50 border-gold-300/30'}`}>
          {[
            { c: 'bg-emerald-500', l: 'Onaylı' },
            { c: 'bg-gold-500', l: 'Beklemede' },
            { c: 'bg-sea-400', l: 'Müsait' },
            { c: 'ring-2 ring-gold-300', l: 'Bugün' },
          ].map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${it.c} ${it.c.startsWith('ring') ? 'bg-transparent' : ''}`} />
              <span className={`text-[10px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-cream/75' : 'text-mute'}`}>{it.l}</span>
            </div>
          ))}
        </div>

        {/* Hafta günleri */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((g) => (
            <div key={g} className={`text-center py-2 text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600/80'}`}>
              {g}
            </div>
          ))}
        </div>

        {/* Günler grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            const inMonth = day.getMonth() === currentMonth.getMonth()
            const rez = findReservation(day)
            const isToday = isSameDay(day, today)
            const isPast = day < today && !isToday
            const isApproved = rez && (rez.durum === 'onaylandi' || rez.durum === 'onaylandı')
            const isPending = rez && rez.durum === 'beklemede'

            return (
              <div
                key={idx}
                className={`relative h-24 rounded-lg border transition-all duration-200 ${
                  !inMonth ? (isDark ? 'bg-sea-800/20 border-gold-500/5' : 'bg-sand-50/40 border-gold-300/15') :
                  isApproved ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-400/60 text-cream' :
                  isPending  ? 'bg-gradient-to-br from-gold-500 to-gold-700 border-gold-300/60 text-sea-900' :
                              (isDark ? 'bg-sea-800/60 border-gold-500/15 hover:border-gold-500/40' : 'bg-cream border-gold-300/30 hover:border-gold-500')
                } ${isToday ? 'ring-2 ring-gold-300 ring-offset-2 ' + (isDark ? 'ring-offset-sea-900' : 'ring-offset-cream') : ''} ${isPast && !rez && inMonth ? 'opacity-40' : ''}`}
              >
                {inMonth && (
                  <>
                    {/* Gün numarası */}
                    <div className="absolute top-1.5 left-2 right-2 flex items-start justify-between">
                      <span className={`font-display text-sm font-semibold tabular-nums ${
                        isPending ? 'text-sea-900' :
                        rez ? 'text-cream' :
                        (isDark ? 'text-cream/85' : 'text-sea-900')
                      }`}>
                        {day.getDate()}
                      </span>
                      {rez && (
                        <span className={`text-[9px] rounded-full px-1.5 py-0.5 backdrop-blur ${
                          isPending ? 'bg-sea-900/20 text-sea-900' : 'bg-cream/25 text-cream'
                        }`}>
                          {isApproved ? '✓' : '⏳'}
                        </span>
                      )}
                    </div>
                    {/* Misafir bilgisi */}
                    {rez && (
                      <div className="absolute bottom-1.5 left-2 right-2">
                        <p className={`text-[10px] font-semibold truncate ${isPending ? 'text-sea-900' : 'text-cream'}`}>
                          {rez.ad} {rez.soyad}
                        </p>
                        <p className={`text-[9px] ${isPending ? 'text-sea-900/75' : 'text-cream/80'}`}>
                          {rez.kisi_sayisi} kişi
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ============================================================ */
/* FİYATLANDIRMA TAB                                             */
/* ============================================================ */

/* Sayısal stepper input */
function Stepper({ isDark, value, onChange, step = 1, min = 0, unit = '₺' }) {
  const dec = () => onChange(Math.max(min, +(value || 0) - step))
  const inc = () => onChange(+(value || 0) + step)
  return (
    <div className={`inline-flex items-center rounded-lg border overflow-hidden w-40 shrink-0 ${isDark ? 'border-gold-500/15 bg-sea-800/40' : 'border-gold-300/40 bg-sand-50'}`}>
      <button type="button" onClick={dec} className={`w-9 h-9 shrink-0 flex items-center justify-center transition ${isDark ? 'text-cream/65 hover:bg-sea-800 hover:text-cream' : 'text-mute hover:bg-cream hover:text-sea-900'}`}>−</button>
      <div className="flex-1 flex items-center justify-center gap-1 px-1 min-w-0">
        {unit === '₺' && <span className={`text-[10px] ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>₺</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(min, +e.target.value || 0))}
          className={`w-full min-w-0 text-center text-sm tabular-nums font-semibold bg-transparent outline-none ${isDark ? 'text-cream' : 'text-sea-900'}`}
        />
        {unit && unit !== '₺' && <span className={`text-[10px] ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>{unit}</span>}
      </div>
      <button type="button" onClick={inc} className={`w-9 h-9 shrink-0 flex items-center justify-center transition ${isDark ? 'text-cream/65 hover:bg-sea-800 hover:text-cream' : 'text-mute hover:bg-cream hover:text-sea-900'}`}>+</button>
    </div>
  )
}

/* Donem satırı (Sezon & Tatil listesi için) */
function DonemRow({ isDark, donem, onEdit, onDelete }) {
  const toneColor = {
    sea:     'bg-sea-400',
    blue:    'bg-blue-400',
    emerald: 'bg-emerald-400',
    gold:    'bg-gold-500',
    rose:    'bg-rose-400',
    amber:   'bg-amber-400',
  }[donem.tone] || 'bg-sea-400'
  const baslangic = new Date(donem.baslangic).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: '2-digit' })
  const bitis = new Date(donem.bitis).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: '2-digit' })
  return (
    <div className={`group flex items-center gap-3 px-3 py-3 rounded-lg border ${isDark ? 'border-gold-500/10 bg-sea-800/30 hover:border-gold-500/30' : 'border-gold-300/30 bg-sand-50 hover:border-gold-500/50'} transition`}>
      <span className={`w-1 h-10 rounded-full ${toneColor} shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>{donem.ad}</p>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${isDark ? 'bg-sea-700 text-cream/70' : 'bg-sand-200 text-mute'}`}>
            {donem.minGece} gece min.
          </span>
        </div>
        <p className={`text-[11px] mt-0.5 ${isDark ? 'text-cream/55' : 'text-mute'}`}>
          📅 {baslangic} — {bitis}{donem.aciklama ? '  ·  ' + donem.aciklama : ''}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-semibold tabular-nums ${isDark ? 'text-cream' : 'text-sea-900'}`}>{formatTL(donem.fiyat)}</p>
        <p className={`text-[10px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>/ gece</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
        <button type="button" onClick={() => onEdit(donem)} aria-label="Düzenle" className={`w-7 h-7 rounded-md flex items-center justify-center ${isDark ? 'text-cream/55 hover:text-gold-300 hover:bg-sea-800/50' : 'text-mute hover:text-gold-700 hover:bg-gold-50'}`}>
          <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
        <button type="button" onClick={() => onDelete(donem)} aria-label="Sil" className={`w-7 h-7 rounded-md flex items-center justify-center ${isDark ? 'text-cream/55 hover:text-rose-300 hover:bg-rose-500/10' : 'text-mute hover:text-rose-600 hover:bg-rose-50'}`}>
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  )
}

function Fiyatlandirma({ isDark }) {
  /* === State === */
  const [taban, setTaban] = useState({
    haftaIci: 5000,
    haftaSonuPct: 16,
    temizlik: 1200,
    minGece: 3,
    ekMisafir: 400,
  })
  const [sure, setSure] = useState({
    haftalikPct: 10,
    aylikPct: 22,
  })
  const [donemler, setDonemler] = useState([
    { id: 1, ad: 'Kış (Düşük)',    tone: 'sea',     baslangic: '2026-01-10', bitis: '2026-03-15', fiyat: 3200, minGece: 2, aciklama: 'Sezon dışı, esnek kurallar' },
    { id: 2, ad: 'Erken İlkbahar',  tone: 'blue',    baslangic: '2026-04-01', bitis: '2026-05-15', fiyat: 4250, minGece: 3, aciklama: 'Sezon öncesi indirimli dönem' },
    { id: 3, ad: 'Bayram Tatili',    tone: 'emerald', baslangic: '2026-06-06', bitis: '2026-06-10', fiyat: 6000, minGece: 4, aciklama: 'Kurban Bayramı yoğun talep' },
    { id: 4, ad: 'Yüksek Sezon',     tone: 'gold',    baslangic: '2026-07-01', bitis: '2026-08-31', fiyat: 6500, minGece: 5, aciklama: 'Temmuz-Ağustos plaj sezonu zirvesi' },
    { id: 5, ad: 'Yılbaşı',           tone: 'rose',   baslangic: '2026-12-27', bitis: '2027-01-02', fiyat: 7200, minGece: 4, aciklama: 'Yeni yıl özel fiyatı' },
  ])
  const [donemModal, setDonemModal] = useState({ open: false, editing: null })

  /* Preview */
  const [pGiris, setPGiris]       = useState('2026-07-14')
  const [pCikis, setPCikis]       = useState('2026-07-21')
  const [pMisafir, setPMisafir]   = useState(2)

  /* === Hesaplama === */
  const preview = useMemo(() => {
    if (!pGiris || !pCikis) return null
    const giris = new Date(pGiris)
    const cikis = new Date(pCikis)
    if (cikis <= giris) return null
    const geceSayisi = Math.max(1, Math.ceil((cikis - giris) / 86400000))

    /* Her gün için ayrı dönem ve fiyat hesabı */
    const gunler = []
    const cursor = new Date(giris)
    for (let i = 0; i < geceSayisi; i++) {
      // Bu güne denk gelen dönem (her gün için ayrı kontrol)
      const donem = donemler.find(d => {
        const dS = new Date(d.baslangic)
        const dE = new Date(d.bitis)
        return cursor >= dS && cursor < dE
      })
      const dayOfWeek = cursor.getDay() // 0=Paz, 5=Cum, 6=Cmt
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6
      let fiyat, label
      if (donem) {
        fiyat = donem.fiyat
        label = donem.ad
      } else if (isWeekend) {
        fiyat = Math.round(taban.haftaIci * (1 + taban.haftaSonuPct / 100))
        label = 'Hafta sonu'
      } else {
        fiyat = taban.haftaIci
        label = 'Hafta içi'
      }
      gunler.push({ donem, isWeekend, fiyat, label, key: donem ? `donem-${donem.id}` : (isWeekend ? 'haftaSonu' : 'haftaIci') })
      cursor.setDate(cursor.getDate() + 1)
    }

    /* Gruplara ayır (breakdown için) */
    const gruplarObj = {}
    gunler.forEach(g => {
      if (!gruplarObj[g.key]) {
        gruplarObj[g.key] = { label: g.label, fiyat: g.fiyat, sayi: 0, toplam: 0, tone: g.donem ? g.donem.tone : (g.isWeekend ? 'amber' : 'sea') }
      }
      gruplarObj[g.key].sayi += 1
      gruplarObj[g.key].toplam += g.fiyat
    })
    // Display sırası: dönemler önce, sonra hafta içi/sonu
    const gruplar = Object.values(gruplarObj).sort((a, b) => {
      const pri = (x) => (x.tone === 'sea' || x.tone === 'amber') ? 2 : 1
      return pri(a) - pri(b)
    })

    const toplamGecelik = gunler.reduce((s, g) => s + g.fiyat, 0)

    /* Aktif dönem(ler) — display rozeti için */
    const benzerDonemIds = [...new Set(gunler.filter(g => g.donem).map(g => g.donem.id))]
    const kapsayanDonemler = benzerDonemIds.map(id => donemler.find(d => d.id === id))
    const aktifDonem = kapsayanDonemler[0] || null  // ilki (rozet için)
    const kismi = kapsayanDonemler.length > 0 && gunler.some(g => !g.donem)  // bazı günler dönem dışında

    /* Ek misafir */
    const ekMisafirSayisi = Math.max(0, pMisafir - 2)
    const ekMisafirToplam = ekMisafirSayisi * geceSayisi * taban.ekMisafir

    /* Indirim */
    let indirimPct = 0, indirimAd = null
    if (geceSayisi >= 28)      { indirimPct = sure.aylikPct;    indirimAd = 'Aylık indirim' }
    else if (geceSayisi >= 7)  { indirimPct = sure.haftalikPct; indirimAd = 'Haftalık indirim' }
    const indirimMiktar = Math.round((toplamGecelik + ekMisafirToplam) * indirimPct / 100)

    const temizlik = taban.temizlik
    const toplam = toplamGecelik + ekMisafirToplam - indirimMiktar + temizlik
    const gunlukOrt = Math.round(toplam / geceSayisi)

    /* Min gece — kapsayan dönemler içinde en kısıtlayıcı olan */
    let minGereken = taban.minGece
    kapsayanDonemler.forEach(d => { if (d && d.minGece > minGereken) minGereken = d.minGece })
    const minWarning = geceSayisi < minGereken ? minGereken : null

    return { geceSayisi, aktifDonem, kismi, gruplar, toplamGecelik, ekMisafirToplam, indirimPct, indirimAd, indirimMiktar, temizlik, toplam, gunlukOrt, minWarning }
  }, [pGiris, pCikis, pMisafir, taban, sure, donemler])

  /* Handlers */
  const saveDonem = (data) => {
    if (donemModal.editing) {
      setDonemler(donemler.map(d => d.id === donemModal.editing.id ? { ...donemModal.editing, ...data } : d))
    } else {
      setDonemler([...donemler, { id: Date.now(), tone: 'gold', ...data }])
    }
    setDonemModal({ open: false, editing: null })
  }
  const delDonem = (d) => {
    if (window.confirm(`"${d.ad}" silinsin mi?`)) setDonemler(donemler.filter(x => x.id !== d.id))
  }

  return (
    <div className="space-y-3">
      {/* Üst başlık */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className={`font-display text-3xl font-light tracking-tight ${isDark ? 'text-cream' : 'text-sea-900'}`}>Fiyatlandırma</h2>
          <p className={`text-[12px] mt-1 ${isDark ? 'text-cream/65' : 'text-mute'}`}>
            Taban gecelik <span className={`tabular-nums font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>{formatTL(taban.haftaIci)}</span>
            <span className={`mx-2 ${isDark ? 'text-cream/30' : 'text-mute/50'}`}>·</span>
            <span className="tabular-nums">{donemler.length}</span> özel dönem tanımlı
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            console.log('Fiyat ayarları:', { taban, sure, donemler })
            alert('Değişiklikler kaydedildi (şu an yerel — Supabase bağlantısı için tablo şeması netleştirilince eklenir).')
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-semibold tracking-wide bg-gold-500 hover:bg-gold-300 text-sea-900 transition shadow-[0_4px_12px_rgba(201,144,96,0.25)]"
        >
          <Save className="w-3.5 h-3.5" strokeWidth={2} />
          Kaydet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* === SOL: Kurallar === */}
        <div className="lg:col-span-2 space-y-3">
          {/* TEMEL KURALLAR */}
          <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="block h-px w-5 bg-gold-500/60" />
              <div>
                <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Temel Kurallar</p>
                <h3 className={`text-base font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Taban Gecelik Fiyat</h3>
              </div>
            </div>
            <div className={`divide-y ${isDark ? 'divide-gold-500/10' : 'divide-gold-300/30'}`}>
              {/* Hafta içi */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-sea-800 border border-gold-500/15' : 'bg-sand-50 border border-gold-300/40'}`}>
                    <Tag className={`w-4 h-4 ${isDark ? 'text-gold-300' : 'text-gold-700'}`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Hafta içi gecelik</p>
                    <p className={`text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>Pazar—Perşembe baz fiyat</p>
                  </div>
                </div>
                <Stepper isDark={isDark} value={taban.haftaIci} onChange={(v) => setTaban({ ...taban, haftaIci: v })} step={100} unit="₺" />
              </div>
              {/* Hafta sonu farkı */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-sea-800 border border-gold-500/15' : 'bg-sand-50 border border-gold-300/40'}`}>
                    <span className={`text-base ${isDark ? 'text-gold-300' : 'text-gold-700'}`}>%</span>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Hafta sonu farkı</p>
                    <p className={`text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>
                      Cuma &amp; Cumartesi · <span className="tabular-nums">{formatTL(Math.round(taban.haftaIci * (1 + taban.haftaSonuPct / 100)))}/gece</span>
                    </p>
                  </div>
                </div>
                <Stepper isDark={isDark} value={taban.haftaSonuPct} onChange={(v) => setTaban({ ...taban, haftaSonuPct: v })} step={1} unit="%" />
              </div>
              {/* Temizlik */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-sea-800 border border-gold-500/15' : 'bg-sand-50 border border-gold-300/40'}`}>
                    <Sparkles className={`w-4 h-4 ${isDark ? 'text-gold-300' : 'text-gold-700'}`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Temizlik ücreti</p>
                    <p className={`text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>Konaklama başına tek seferlik</p>
                  </div>
                </div>
                <Stepper isDark={isDark} value={taban.temizlik} onChange={(v) => setTaban({ ...taban, temizlik: v })} step={50} unit="₺" />
              </div>
              {/* Min konaklama */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-sea-800 border border-gold-500/15' : 'bg-sand-50 border border-gold-300/40'}`}>
                    <Hourglass className={`w-4 h-4 ${isDark ? 'text-gold-300' : 'text-gold-700'}`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Minimum konaklama</p>
                    <p className={`text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>Taban dönemler için geçerli</p>
                  </div>
                </div>
                <Stepper isDark={isDark} value={taban.minGece} onChange={(v) => setTaban({ ...taban, minGece: v })} step={1} min={1} unit="gece" />
              </div>
              {/* Ek misafir */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-sea-800 border border-gold-500/15' : 'bg-sand-50 border border-gold-300/40'}`}>
                    <Users className={`w-4 h-4 ${isDark ? 'text-gold-300' : 'text-gold-700'}`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Ek misafir ücreti</p>
                    <p className={`text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>3. misafirden itibaren / gece</p>
                  </div>
                </div>
                <Stepper isDark={isDark} value={taban.ekMisafir} onChange={(v) => setTaban({ ...taban, ekMisafir: v })} step={50} unit="₺" />
              </div>
            </div>
          </div>

          {/* SÜREYE BAĞLI */}
          <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="block h-px w-5 bg-gold-500/60" />
              <div>
                <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Süreye Bağlı</p>
                <h3 className={`text-base font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Uzun Konaklama İndirimi</h3>
              </div>
            </div>
            <div className={`divide-y ${isDark ? 'divide-gold-500/10' : 'divide-gold-300/30'}`}>
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-sea-800 border border-gold-500/15' : 'bg-sand-50 border border-gold-300/40'}`}>
                    <Calendar className={`w-4 h-4 ${isDark ? 'text-gold-300' : 'text-gold-700'}`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Haftalık indirim</p>
                    <p className={`text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>7 gece ve üzeri rezervasyonlarda</p>
                  </div>
                </div>
                <Stepper isDark={isDark} value={sure.haftalikPct} onChange={(v) => setSure({ ...sure, haftalikPct: v })} step={1} unit="%" />
              </div>
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-sea-800 border border-gold-500/15' : 'bg-sand-50 border border-gold-300/40'}`}>
                    <Calendar className={`w-4 h-4 ${isDark ? 'text-gold-300' : 'text-gold-700'}`} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Aylık indirim</p>
                    <p className={`text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>28 gece ve üzeri rezervasyonlarda</p>
                  </div>
                </div>
                <Stepper isDark={isDark} value={sure.aylikPct} onChange={(v) => setSure({ ...sure, aylikPct: v })} step={1} unit="%" />
              </div>
            </div>
          </div>

          {/* SEZON & TATİL */}
          <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="block h-px w-5 bg-gold-500/60" />
                <div>
                  <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Sezon &amp; Tatil</p>
                  <h3 className={`text-base font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Özel Fiyat Dönemleri</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDonemModal({ open: true, editing: null })}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-gold-500 hover:bg-gold-300 text-sea-900 transition"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.2} />
                Dönem ekle
              </button>
            </div>
            <div className="space-y-2">
              {donemler.length === 0 ? (
                <p className={`text-center py-8 text-sm ${isDark ? 'text-cream/55' : 'text-mute'}`}>Henüz dönem yok</p>
              ) : donemler.map(d => (
                <DonemRow
                  key={d.id}
                  isDark={isDark}
                  donem={d}
                  onEdit={(donem) => setDonemModal({ open: true, editing: donem })}
                  onDelete={delDonem}
                />
              ))}
            </div>
          </div>
        </div>

        {/* === SAĞ: Canlı Önizleme === */}
        <div className="lg:col-span-1">
          <div className={`sticky top-20 ${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-5`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="block h-px w-5 bg-gold-500/60" />
              <div>
                <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Canlı Önizleme</p>
                <h3 className={`text-base font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>Misafir Ne Öder?</h3>
              </div>
            </div>

            {/* Tarih + misafir inputları */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className={`block text-[9px] tracking-[0.22em] uppercase font-semibold mb-1 ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>Giriş</label>
                <DatePickerTR
                  value={pGiris}
                  onChange={setPGiris}
                  placeholder="gg/aa/yyyy"
                  className="w-full"
                  inputClassName={`w-full px-2 py-1.5 rounded-md border text-xs outline-none cursor-pointer ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream placeholder-cream/40' : 'bg-sand-50 border-gold-300/40 text-sea-900 placeholder-mute'}`}
                />
              </div>
              <div>
                <label className={`block text-[9px] tracking-[0.22em] uppercase font-semibold mb-1 ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>Çıkış</label>
                <DatePickerTR
                  value={pCikis}
                  onChange={setPCikis}
                  minDate={pGiris}
                  placeholder="gg/aa/yyyy"
                  className="w-full"
                  inputClassName={`w-full px-2 py-1.5 rounded-md border text-xs outline-none cursor-pointer ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream placeholder-cream/40' : 'bg-sand-50 border-gold-300/40 text-sea-900 placeholder-mute'}`}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className={`block text-[9px] tracking-[0.22em] uppercase font-semibold mb-1 ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>Misafir Sayısı</label>
              <Stepper isDark={isDark} value={pMisafir} onChange={setPMisafir} step={1} min={1} unit="kişi" />
            </div>

            {/* Sonuç */}
            {preview && (
              <>
                <div className={`flex items-center justify-between gap-3 pb-3 mb-3 border-b ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'}`}>
                  <div>
                    <p className={`font-display text-3xl font-semibold tabular-nums ${isDark ? 'text-cream' : 'text-sea-900'}`}>
                      {formatTL(preview.gunlukOrt)}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-cream/55' : 'text-mute'}`}>/ gece ort.</p>
                  </div>
                  {preview.aktifDonem && (
                    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gold-500/15 text-gold-300 border border-gold-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                      {preview.aktifDonem.ad}{preview.kismi ? ' (kısmi)' : ''}
                    </span>
                  )}
                </div>

                {/* Breakdown — gruplara göre */}
                <div className="space-y-1.5">
                  {preview.gruplar.map((g, i) => (
                    <div key={i} className="flex items-center justify-between text-[12px]">
                      <span className={isDark ? 'text-cream/65' : 'text-mute'}>
                        {g.label} <span className="opacity-65">({formatTL(g.fiyat)} × {g.sayi} gece)</span>
                      </span>
                      <span className={`tabular-nums ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>{formatTL(g.toplam)}</span>
                    </div>
                  ))}
                  {preview.ekMisafirToplam > 0 && (
                    <div className="flex items-center justify-between text-[12px]">
                      <span className={isDark ? 'text-cream/65' : 'text-mute'}>Ek misafir ücreti</span>
                      <span className={`tabular-nums ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>{formatTL(preview.ekMisafirToplam)}</span>
                    </div>
                  )}
                  {preview.indirimMiktar > 0 && (
                    <div className="flex items-center justify-between text-[12px]">
                      <span className={isDark ? 'text-cream/65' : 'text-mute'}>{preview.indirimAd} (%{preview.indirimPct})</span>
                      <span className="tabular-nums text-emerald-400">−{formatTL(preview.indirimMiktar)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[12px]">
                    <span className={isDark ? 'text-cream/65' : 'text-mute'}>Temizlik ücreti</span>
                    <span className={`tabular-nums ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>{formatTL(preview.temizlik)}</span>
                  </div>
                </div>

                {/* Toplam */}
                <div className={`mt-3 pt-3 border-t flex items-center justify-between ${isDark ? 'border-gold-500/15' : 'border-gold-300/40'}`}>
                  <span className={`text-sm font-semibold ${isDark ? 'text-cream' : 'text-sea-900'}`}>
                    Toplam <span className={`text-[11px] font-normal ${isDark ? 'text-cream/55' : 'text-mute'}`}>({preview.geceSayisi} gece)</span>
                  </span>
                  <span className={`font-display text-2xl font-semibold tabular-nums text-gold-300`}>{formatTL(preview.toplam)}</span>
                </div>

                {/* Min gece uyarısı */}
                {preview.minWarning && (
                  <div className={`mt-3 px-3 py-2 rounded-lg text-[11px] flex items-start gap-2 ${isDark ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    <span>⚠ï¸</span>
                    <span>Bu tarih aralığı için minimum konaklama <strong className="tabular-nums">{preview.minWarning} gece</strong>.</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dönem ekle/düzenle modal */}
      <DonemModal
        isDark={isDark}
        open={donemModal.open}
        editing={donemModal.editing}
        onClose={() => setDonemModal({ open: false, editing: null })}
        onSave={saveDonem}
      />
    </div>
  )
}

/* ============================================================ */
/* DÖNEM MODAL                                                   */
/* ============================================================ */
function DonemModal({ isDark, open, editing, onClose, onSave }) {
  const [form, setForm] = useState({ ad: '', tone: 'gold', baslangic: '', bitis: '', fiyat: 5000, minGece: 3, aciklama: '' })

  useEffect(() => {
    if (editing) {
      setForm({
        ad: editing.ad || '',
        tone: editing.tone || 'gold',
        baslangic: editing.baslangic || '',
        bitis: editing.bitis || '',
        fiyat: editing.fiyat || 5000,
        minGece: editing.minGece || 3,
        aciklama: editing.aciklama || '',
      })
    } else {
      setForm({ ad: '', tone: 'gold', baslangic: '', bitis: '', fiyat: 5000, minGece: 3, aciklama: '' })
    }
  }, [editing, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-sea-900/70 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className={`relative max-w-md w-full rounded-2xl border shadow-2xl ${isDark ? 'bg-sea-900 border-gold-500/20' : 'bg-cream border-gold-300/40'}`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'}`}>
          <div>
            <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Özel Dönem</p>
            <h3 className={`font-display text-2xl font-light ${isDark ? 'text-cream' : 'text-sea-900'}`}>{editing ? 'Düzenle' : 'Yeni Dönem'}</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" className={`w-8 h-8 rounded-md flex items-center justify-center ${isDark ? 'text-cream/55 hover:bg-sea-800/50 hover:text-cream' : 'text-mute hover:bg-sand-50 hover:text-sea-900'}`}>
            <X className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="px-6 py-5 space-y-4">
          <div>
            <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Dönem Adı</label>
            <input type="text" value={form.ad} onChange={(e) => setForm({ ...form, ad: e.target.value })} placeholder="Örn. Yaz Sezonu" required className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream placeholder-cream/35' : 'bg-cream border-gold-300/40 text-sea-900 placeholder-mute'}`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Başlangıç</label>
              <DatePickerTR
                value={form.baslangic}
                onChange={(val) => setForm({ ...form, baslangic: val })}
                placeholder="gg/aa/yyyy"
                className="w-full"
                inputClassName={`w-full px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream placeholder-cream/40' : 'bg-cream border-gold-300/40 text-sea-900 placeholder-mute'}`}
              />
            </div>
            <div>
              <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Bitiş</label>
              <DatePickerTR
                value={form.bitis}
                onChange={(val) => setForm({ ...form, bitis: val })}
                minDate={form.baslangic}
                placeholder="gg/aa/yyyy"
                className="w-full"
                inputClassName={`w-full px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream placeholder-cream/40' : 'bg-cream border-gold-300/40 text-sea-900 placeholder-mute'}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Fiyat (₺)</label>
              <input type="number" value={form.fiyat} onChange={(e) => setForm({ ...form, fiyat: +e.target.value || 0 })} required min="0" className={`w-full px-3 py-2 rounded-lg border text-sm tabular-nums outline-none ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream' : 'bg-cream border-gold-300/40 text-sea-900'}`} />
            </div>
            <div>
              <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Min. Gece</label>
              <input type="number" value={form.minGece} onChange={(e) => setForm({ ...form, minGece: +e.target.value || 1 })} required min="1" className={`w-full px-3 py-2 rounded-lg border text-sm tabular-nums outline-none ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream' : 'bg-cream border-gold-300/40 text-sea-900'}`} />
            </div>
          </div>
          <div>
            <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Renk Tonu</label>
            <div className="flex items-center gap-2">
              {[
                { id: 'sea',     bg: 'bg-sea-400'     },
                { id: 'blue',    bg: 'bg-blue-400'    },
                { id: 'emerald', bg: 'bg-emerald-400' },
                { id: 'gold',    bg: 'bg-gold-500'    },
                { id: 'amber',   bg: 'bg-amber-400'   },
                { id: 'rose',    bg: 'bg-rose-400'    },
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setForm({ ...form, tone: t.id })}
                  className={`w-7 h-7 rounded-md ${t.bg} ${form.tone === t.id ? 'ring-2 ring-offset-2 ring-gold-300 ' + (isDark ? 'ring-offset-sea-900' : 'ring-offset-cream') : 'opacity-60 hover:opacity-100'} transition`}
                  aria-label={t.id}
                />
              ))}
            </div>
          </div>
          <div>
            <label className={`block text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Açıklama</label>
            <input type="text" value={form.aciklama} onChange={(e) => setForm({ ...form, aciklama: e.target.value })} placeholder="Kısa not (opsiyonel)" className={`w-full px-3 py-2 rounded-lg border text-sm outline-none ${isDark ? 'bg-sea-800/60 border-gold-500/15 text-cream placeholder-cream/35' : 'bg-cream border-gold-300/40 text-sea-900 placeholder-mute'}`} />
          </div>
          <div className={`pt-3 border-t flex items-center gap-2 ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'}`}>
            <button type="button" onClick={onClose} className={`flex-1 px-4 py-2 rounded-lg text-[11px] font-semibold border transition ${isDark ? 'border-gold-500/15 text-cream/85 hover:bg-sea-800/50' : 'border-gold-300/40 text-sea-900 hover:bg-sand-50'}`}>İptal</button>
            <button type="submit" className="flex-1 px-4 py-2 rounded-lg text-[11px] font-semibold bg-gold-500 hover:bg-gold-300 text-sea-900 transition">{editing ? 'Güncelle' : 'Ekle'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}



/* ============================================================ */
/* MESAJLAR TAB                                                  */
/* ============================================================ */
function Mesajlar({ isDark, mesajlar, onRead, onDelete }) {
  const [filter, setFilter] = useState('all')
  const [detayMesaj, setDetayMesaj] = useState(null)

  const matches = (m, key) => {
    if (key === 'all') return true
    if (key === 'okunmamis') return !m.okundu
    if (key === 'okundu') return !!m.okundu
    if (key === 'bugun') {
      const d = new Date(m.created_at)
      const now = new Date()
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
    }
    return true
  }
  const counts = {
    all: mesajlar.length,
    okunmamis: mesajlar.filter(m => matches(m, 'okunmamis')).length,
    okundu: mesajlar.filter(m => matches(m, 'okundu')).length,
    bugun: mesajlar.filter(m => matches(m, 'bugun')).length,
  }
  const filtered = mesajlar
    .filter(m => matches(m, filter))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const chips = [
    { id: 'all',       label: 'Tümü' },
    { id: 'okunmamis', label: 'Okunmamış' },
    { id: 'okundu',    label: 'Okundu' },
    { id: 'bugun',     label: 'Bugün' },
  ]

  const kpis = [
    { label: 'Toplam Mesaj',  value: counts.all,       tone: 'sea' },
    { label: 'Okunmamış',     value: counts.okunmamis, tone: 'amber' },
    { label: 'Bugün',         value: counts.bugun,     tone: 'emerald' },
    { label: 'Cevap Bekleyen', value: counts.okunmamis, tone: 'gold' },
  ]

  const handleOpen = async (m) => {
    setDetayMesaj(m)
    if (!m.okundu) await onRead(m, true)
  }

  return (
    <div className="space-y-3">
      {/* Mini KPI'lar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>{k.label}</p>
              <span className={`w-2 h-2 rounded-full ${
                k.tone === 'gold'    ? 'bg-gold-500'    :
                k.tone === 'emerald' ? 'bg-emerald-400' :
                k.tone === 'amber'   ? 'bg-amber-400'   :
                                       'bg-sea-400'
              }`} />
            </div>
            <p className={`text-2xl font-semibold tabular-nums tracking-tight ${isDark ? 'text-cream' : 'text-sea-900'}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {chips.map(c => {
            const active = filter === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition border ${
                  active
                    ? (isDark ? 'bg-sea-800 text-cream border-gold-500/40' : 'bg-sea-900 text-cream border-sea-900')
                    : (isDark ? 'border-gold-500/15 text-cream/65 hover:border-gold-500/40' : 'border-gold-300/40 text-mute hover:border-gold-500')
                }`}
              >
                {c.label}
                <span className={`tabular-nums ${active ? 'opacity-85' : 'opacity-65'}`}>{counts[c.id] || 0}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Inbox liste */}
      <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl overflow-hidden`}>
        {filtered.length === 0 ? (
          <div className={`px-5 py-14 text-center ${isDark ? 'text-cream/55' : 'text-mute'}`}>
            <Inbox className="w-8 h-8 mx-auto mb-3 opacity-60" strokeWidth={1.4} />
            <p className="text-sm">Bu filtrede mesaj yok</p>
          </div>
        ) : filtered.map(m => {
          const ad = m.ad_soyad || m.ad || 'Misafir'
          const initials = ad.split(' ').slice(0, 2).map(s => (s[0] || '').toUpperCase()).join('') || '?'
          const unread = !m.okundu
          const preview = (m.mesaj || '').slice(0, 90)
          return (
            <div
              key={m.id}
              onClick={() => handleOpen(m)}
              className={`grid grid-cols-12 gap-3 px-5 py-3 items-center border-b last:border-0 cursor-pointer transition ${
                isDark ? 'border-gold-500/10 hover:bg-sea-800/30' : 'border-gold-300/20 hover:bg-sand-50/60'
              } ${unread ? (isDark ? 'bg-sea-800/20' : 'bg-gold-50/40') : ''}`}
            >
              {/* Sol: avatar + unread dot */}
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center text-[11px] font-bold ${unread ? 'bg-gold-500 text-sea-900' : (isDark ? 'bg-sea-700 text-cream/85' : 'bg-gold-500/15 text-gold-700')}`}>
                    {initials}
                  </div>
                  {unread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-gold-500 ring-2 ring-sea-900" />}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm truncate ${unread ? 'font-bold' : 'font-medium'} ${isDark ? 'text-cream' : 'text-sea-900'}`}>{ad}</p>
                  <p className={`text-[11px] truncate ${isDark ? 'text-cream/55' : 'text-mute'}`}>{m.email || m.telefon || '—'}</p>
                </div>
              </div>
              {/* Orta: konu + preview */}
              <div className="col-span-6 min-w-0">
                <p className={`text-sm truncate ${unread ? 'font-semibold' : ''} ${isDark ? 'text-cream' : 'text-sea-900'}`}>
                  {m.konu || '(konu yok)'}
                </p>
                <p className={`text-[11px] mt-0.5 truncate ${isDark ? 'text-cream/55' : 'text-mute'}`}>
                  {preview}{(m.mesaj || '').length > 90 ? '…' : ''}
                </p>
              </div>
              {/* Sağ: zaman + actions */}
              <div className="col-span-3 flex items-center justify-end gap-2">
                <span className={`text-[11px] tabular-nums shrink-0 ${isDark ? 'text-cream/45' : 'text-mute'}`}>{timeAgo(new Date(m.created_at))}</span>
                {m.email ? (
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.konu || 'Mesajınız'))}`}
                    onClick={(e) => { e.stopPropagation(); if (unread) onRead(m, true) }}
                    aria-label="Cevapla"
                    title="Cevapla"
                    className={`w-7 h-7 rounded-md flex items-center justify-center transition ${isDark ? 'text-cream/55 hover:text-gold-300 hover:bg-sea-800/50' : 'text-mute hover:text-gold-700 hover:bg-gold-50'}`}
                  >
                    <Mail className="w-3.5 h-3.5" strokeWidth={1.8} />
                  </a>
                ) : (
                  <span className={`w-7 h-7 flex items-center justify-center opacity-30 ${isDark ? 'text-cream/55' : 'text-mute'}`} title="E-posta yok">
                    <Mail className="w-3.5 h-3.5" strokeWidth={1.8} />
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDelete(m) }}
                  aria-label="Sil"
                  className={`w-7 h-7 rounded-md flex items-center justify-center transition ${isDark ? 'text-cream/55 hover:text-rose-300 hover:bg-rose-500/10' : 'text-mute hover:text-rose-600 hover:bg-rose-50'}`}
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detay modal */}
      <MesajDetayModal isDark={isDark} mesaj={detayMesaj} onClose={() => setDetayMesaj(null)} onDelete={onDelete} />
    </div>
  )
}

function MesajDetayModal({ isDark, mesaj, onClose, onDelete }) {
  if (!mesaj) return null
  const ad = mesaj.ad_soyad || mesaj.ad || 'Misafir'
  const initials = ad.split(' ').slice(0, 2).map(s => (s[0] || '').toUpperCase()).join('') || '?'
  const tarih = new Date(mesaj.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-sea-900/70 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className={`relative max-w-xl w-full rounded-2xl border shadow-2xl ${isDark ? 'bg-sea-900 border-gold-500/20' : 'bg-cream border-gold-300/40'}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-start justify-between gap-3 ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 bg-gold-500 text-sea-900`}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Mesaj</p>
              <h3 className={`font-display text-xl font-light truncate ${isDark ? 'text-cream' : 'text-sea-900'}`}>{ad}</h3>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" className={`w-8 h-8 shrink-0 rounded-md flex items-center justify-center ${isDark ? 'text-cream/55 hover:bg-sea-800/50 hover:text-cream' : 'text-mute hover:bg-sand-50 hover:text-sea-900'}`}>
            <X className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            {mesaj.email && (
              <div>
                <p className={`text-[10px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>E-posta</p>
                <a href={`mailto:${mesaj.email}`} className={`mt-0.5 inline-flex items-center gap-1.5 truncate transition ${isDark ? 'text-cream hover:text-gold-300' : 'text-sea-900 hover:text-gold-700'}`}>
                  <Mail className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                  {mesaj.email}
                </a>
              </div>
            )}
            {mesaj.telefon && (
              <div>
                <p className={`text-[10px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>Telefon</p>
                <a href={`tel:${mesaj.telefon}`} className={`mt-0.5 inline-flex items-center gap-1.5 transition ${isDark ? 'text-cream hover:text-gold-300' : 'text-sea-900 hover:text-gold-700'}`}>
                  <Phone className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                  {mesaj.telefon}
                </a>
              </div>
            )}
            <div className="col-span-2">
              <p className={`text-[10px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>Tarih</p>
              <p className={`mt-0.5 ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>{tarih}</p>
            </div>
          </div>

          {/* Konu + Mesaj */}
          <div className={`border-t pt-4 ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'}`}>
            {mesaj.konu && (
              <h4 className={`font-semibold text-sm mb-2 ${isDark ? 'text-cream' : 'text-sea-900'}`}>{mesaj.konu}</h4>
            )}
            <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${isDark ? 'text-cream/85' : 'text-sea-900'}`} style={{ overflowWrap: 'anywhere' }}>
              {mesaj.mesaj || '(içerik yok)'}
            </p>
          </div>
        </div>

        {/* Footer eylemler */}
        <div className={`px-6 py-4 border-t flex items-center justify-between gap-2 ${isDark ? 'border-gold-500/10 bg-sea-900/40' : 'border-gold-300/30 bg-sand-50/40'}`}>
          <button
            type="button"
            onClick={() => { onDelete(mesaj); onClose() }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-semibold transition ${isDark ? 'text-rose-300 hover:bg-rose-500/10' : 'text-rose-700 hover:bg-rose-50'}`}
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
            Sil
          </button>
          <div className="flex items-center gap-2">
            {mesaj.telefon && (
              <a
                href={`tel:${mesaj.telefon}`}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-semibold border transition ${isDark ? 'border-gold-500/15 text-cream/85 bg-sea-800/40 hover:border-gold-500/40' : 'border-gold-300/40 text-sea-900 bg-cream hover:border-gold-500'}`}
              >
                <Phone className="w-3.5 h-3.5" strokeWidth={1.8} />
                Ara
              </a>
            )}
            {mesaj.email && (
              <a
                href={`mailto:${mesaj.email}?subject=Re: ${mesaj.konu || 'Mesajınız'}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-semibold bg-gold-500 hover:bg-gold-300 text-sea-900 transition"
              >
                <Reply className="w-3.5 h-3.5" strokeWidth={2} />
                Cevapla
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================ */
/* YORUMLAR                                                       */
/* ============================================================ */
function StarsRow({ rating, size = 'sm' }) {
  const px = size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          className={`${px} ${n <= rating ? 'text-gold-500 fill-gold-500' : 'text-gold-500/25'}`}
          strokeWidth={1.6}
        />
      ))}
    </div>
  )
}

function Yorumlar({ isDark, yorumlar, onApprove, onReject, onDelete }) {
  const [filter, setFilter] = useState('all')
  const [detayYorum, setDetayYorum] = useState(null)

  const matches = (y, key) => {
    if (key === 'all')       return true
    if (key === 'bekleyen')  return !y.onaylandi
    if (key === 'onayli')    return !!y.onaylandi
    if (key === '5')         return y.puan === 5
    if (key === '4')         return y.puan === 4
    if (key === 'low')       return y.puan <= 3
    return true
  }
  const counts = {
    all:      yorumlar.length,
    bekleyen: yorumlar.filter(y => !y.onaylandi).length,
    onayli:   yorumlar.filter(y => !!y.onaylandi).length,
    '5':      yorumlar.filter(y => y.puan === 5).length,
    '4':      yorumlar.filter(y => y.puan === 4).length,
    low:      yorumlar.filter(y => y.puan <= 3).length,
  }
  const filtered = yorumlar
    .filter(y => matches(y, filter))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const avgPuan = yorumlar.length
    ? (yorumlar.reduce((s, y) => s + (y.puan || 0), 0) / yorumlar.length).toFixed(1)
    : '0.0'

  const chips = [
    { id: 'all',      label: 'Tümü' },
    { id: 'bekleyen', label: 'Onay Bekleyen' },
    { id: 'onayli',   label: 'Onaylı' },
    { id: '5',        label: '5★' },
    { id: '4',        label: '4★' },
    { id: 'low',      label: '3★ ve altı' },
  ]

  const kpis = [
    { label: 'Toplam Yorum',  value: counts.all,      tone: 'sea' },
    { label: 'Ortalama Puan', value: avgPuan,         tone: 'gold', star: true },
    { label: 'Onay Bekleyen', value: counts.bekleyen, tone: 'amber' },
    { label: '5★ Sayısı',     value: counts['5'],     tone: 'emerald' },
  ]

  return (
    <div className="space-y-3">
      {/* KPI'lar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>{k.label}</p>
              <span className={`w-2 h-2 rounded-full ${
                k.tone === 'gold'    ? 'bg-gold-500'    :
                k.tone === 'emerald' ? 'bg-emerald-400' :
                k.tone === 'amber'   ? 'bg-amber-400'   :
                                       'bg-sea-400'
              }`} />
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-semibold tabular-nums tracking-tight ${isDark ? 'text-cream' : 'text-sea-900'}`}>{k.value}</p>
              {k.star && <Star className="w-4 h-4 text-gold-500 fill-gold-500" strokeWidth={1.6} />}
            </div>
          </div>
        ))}
      </div>

      {/* Filtre chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {chips.map(c => {
          const active = filter === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition border ${
                active
                  ? (isDark ? 'bg-sea-800 text-cream border-gold-500/40' : 'bg-sea-900 text-cream border-sea-900')
                  : (isDark ? 'border-gold-500/15 text-cream/65 hover:border-gold-500/40' : 'border-gold-300/40 text-mute hover:border-gold-500')
              }`}
            >
              {c.label}
              <span className={`tabular-nums ${active ? 'opacity-85' : 'opacity-65'}`}>{counts[c.id] || 0}</span>
            </button>
          )
        })}
      </div>

      {/* Yorum kartları */}
      {filtered.length === 0 ? (
        <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15 text-cream/55' : 'bg-cream border-gold-300/40 text-mute'} border rounded-xl px-5 py-14 text-center`}>
          <Star className="w-8 h-8 mx-auto mb-3 opacity-60" strokeWidth={1.4} />
          <p className="text-sm">Bu filtrede yorum yok</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map(y => {
            const ad = y.ad || 'Misafir'
            const initials = ad.split(' ').slice(0, 2).map(s => (s[0] || '').toUpperCase()).join('') || '?'
            const pending = !y.onaylandi
            const preview = (y.yorum || '').slice(0, 180)
            return (
              <div
                key={y.id}
                onClick={() => setDetayYorum(y)}
                className={`relative border rounded-xl p-4 cursor-pointer transition ${
                  isDark
                    ? `bg-sea-900/70 ${pending ? 'border-amber-500/40 hover:border-amber-400/60' : 'border-gold-500/15 hover:border-gold-500/35'}`
                    : `bg-cream ${pending ? 'border-amber-500/50 hover:border-amber-500' : 'border-gold-300/40 hover:border-gold-500'}`
                }`}
              >
                {pending && (
                  <span className={`absolute top-3 right-3 text-[9px] tracking-[0.24em] uppercase font-bold px-2 py-0.5 rounded-md ${isDark ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                    Bekliyor
                  </span>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${pending ? 'bg-amber-500 text-sea-900' : 'bg-gold-500 text-sea-900'}`}>
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold truncate ${isDark ? 'text-cream' : 'text-sea-900'}`}>{ad}</p>
                    <p className={`text-[11px] truncate ${isDark ? 'text-cream/55' : 'text-mute'}`}>{y.email || '—'}</p>
                    <div className="mt-1.5"><StarsRow rating={y.puan || 0} /></div>
                  </div>
                  <span className={`text-[11px] tabular-nums shrink-0 ${isDark ? 'text-cream/45' : 'text-mute'}`} style={{ marginTop: pending ? 18 : 0 }}>
                    {timeAgo(new Date(y.created_at))}
                  </span>
                </div>

                {y.baslik && (
                  <p className={`text-sm font-semibold mb-1.5 line-clamp-1 ${isDark ? 'text-cream' : 'text-sea-900'}`}>
                    “{y.baslik}”
                  </p>
                )}
                <p className={`text-[12.5px] leading-relaxed line-clamp-3 ${isDark ? 'text-cream/75' : 'text-sea-900/85'}`} style={{ overflowWrap: 'anywhere' }}>
                  {preview}{(y.yorum || '').length > 180 ? '…' : ''}
                </p>

                {/* Aksiyonlar */}
                <div className={`mt-3 pt-3 border-t flex items-center justify-end gap-1.5 ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'}`}>
                  {pending ? (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onApprove(y) }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition"
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={2.2} />
                      Onayla
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onReject(y) }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition ${isDark ? 'border-gold-500/15 text-cream/75 hover:border-amber-400/50 hover:text-amber-300' : 'border-gold-300/40 text-sea-900 hover:border-amber-500 hover:text-amber-700'}`}
                    >
                      <X className="w-3.5 h-3.5" strokeWidth={2} />
                      Yayından kaldır
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(y) }}
                    aria-label="Sil"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${isDark ? 'text-cream/55 hover:text-rose-300 hover:bg-rose-500/10' : 'text-mute hover:text-rose-600 hover:bg-rose-50'}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <YorumDetayModal
        isDark={isDark}
        yorum={detayYorum}
        onClose={() => setDetayYorum(null)}
        onApprove={onApprove}
        onReject={onReject}
        onDelete={onDelete}
      />
    </div>
  )
}

function YorumDetayModal({ isDark, yorum, onClose, onApprove, onReject, onDelete }) {
  if (!yorum) return null
  const ad = yorum.ad || 'Misafir'
  const initials = ad.split(' ').slice(0, 2).map(s => (s[0] || '').toUpperCase()).join('') || '?'
  const tarih = new Date(yorum.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  const pending = !yorum.onaylandi

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-sea-900/70 backdrop-blur-sm" />
      <div onClick={(e) => e.stopPropagation()} className={`relative max-w-xl w-full rounded-2xl border shadow-2xl ${isDark ? 'bg-sea-900 border-gold-500/20' : 'bg-cream border-gold-300/40'}`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-start justify-between gap-3 ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${pending ? 'bg-amber-500 text-sea-900' : 'bg-gold-500 text-sea-900'}`}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Yorum</p>
              <h3 className={`font-display text-xl font-light truncate ${isDark ? 'text-cream' : 'text-sea-900'}`}>{ad}</h3>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" className={`w-8 h-8 shrink-0 rounded-md flex items-center justify-center ${isDark ? 'text-cream/55 hover:bg-sea-800/50 hover:text-cream' : 'text-mute hover:bg-sand-50 hover:text-sea-900'}`}>
            <X className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-[12px]">
            {yorum.email && (
              <div>
                <p className={`text-[10px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>E-posta</p>
                <a href={`mailto:${yorum.email}`} className={`mt-0.5 inline-flex items-center gap-1.5 truncate transition ${isDark ? 'text-cream hover:text-gold-300' : 'text-sea-900 hover:text-gold-700'}`}>
                  <Mail className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
                  {yorum.email}
                </a>
              </div>
            )}
            <div>
              <p className={`text-[10px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>Puan</p>
              <div className="mt-0.5 flex items-center gap-2">
                <StarsRow rating={yorum.puan || 0} size="lg" />
                <span className={`text-sm tabular-nums ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>{yorum.puan || 0}/5</span>
              </div>
            </div>
            <div className="col-span-2">
              <p className={`text-[10px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>Tarih</p>
              <p className={`mt-0.5 ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>{tarih}</p>
            </div>
            <div className="col-span-2">
              <p className={`text-[10px] tracking-[0.22em] uppercase font-semibold ${isDark ? 'text-gold-300/70' : 'text-gold-600'}`}>Durum</p>
              <p className={`mt-0.5 inline-flex items-center gap-2 text-sm ${isDark ? 'text-cream/85' : 'text-sea-900'}`}>
                <span className={`w-2 h-2 rounded-full ${pending ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                {pending ? 'Onay bekliyor' : 'Yayında'}
              </p>
            </div>
          </div>

          {/* Başlık + Yorum */}
          <div className={`border-t pt-4 ${isDark ? 'border-gold-500/10' : 'border-gold-300/30'}`}>
            {yorum.baslik && (
              <h4 className={`font-semibold text-base mb-2 ${isDark ? 'text-cream' : 'text-sea-900'}`}>“{yorum.baslik}”</h4>
            )}
            <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${isDark ? 'text-cream/85' : 'text-sea-900'}`} style={{ overflowWrap: 'anywhere' }}>
              {yorum.yorum || '(içerik yok)'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-between gap-2 ${isDark ? 'border-gold-500/10 bg-sea-900/40' : 'border-gold-300/30 bg-sand-50/40'}`}>
          <button
            type="button"
            onClick={() => { onDelete(yorum); onClose() }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-semibold transition ${isDark ? 'text-rose-300 hover:bg-rose-500/10' : 'text-rose-700 hover:bg-rose-50'}`}
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
            Sil
          </button>
          <div className="flex items-center gap-2">
            {pending ? (
              <button
                type="button"
                onClick={() => { onApprove(yorum); onClose() }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition"
              >
                <Check className="w-3.5 h-3.5" strokeWidth={2.2} />
                Onayla ve yayınla
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { onReject(yorum); onClose() }}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-semibold border transition ${isDark ? 'border-gold-500/15 text-cream/85 bg-sea-800/40 hover:border-amber-400/50' : 'border-gold-300/40 text-sea-900 bg-cream hover:border-amber-500'}`}
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
                Yayından kaldır
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================ */
/* NEWSLETTER                                                    */
/* ============================================================ */
function Newsletter({ isDark, abone, onToggle, onDelete }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  const now = new Date()
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 6); startOfWeek.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const matches = (a, key) => {
    if (key === 'all')    return true
    if (key === 'aktif')  return !!a.aktif
    if (key === 'pasif')  return !a.aktif
    if (key === 'ay')     return new Date(a.created_at) >= startOfMonth
    if (key === 'hafta')  return new Date(a.created_at) >= startOfWeek
    return true
  }
  const counts = {
    all:   abone.length,
    aktif: abone.filter(a => a.aktif).length,
    pasif: abone.filter(a => !a.aktif).length,
    ay:    abone.filter(a => matches(a, 'ay')).length,
    hafta: abone.filter(a => matches(a, 'hafta')).length,
  }
  const q = search.trim().toLowerCase()
  const filtered = abone
    .filter(a => matches(a, filter))
    .filter(a => !q || (a.email || '').toLowerCase().includes(q))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  useEffect(() => { setCurrentPage(1) }, [filter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const pageItems = filtered.slice((safePage - 1) * perPage, safePage * perPage)

  const chips = [
    { id: 'all',   label: 'Tümü' },
    { id: 'aktif', label: 'Aktif' },
    { id: 'pasif', label: 'Pasif' },
    { id: 'ay',    label: 'Bu Ay' },
    { id: 'hafta', label: 'Bu Hafta' },
  ]

  const kpis = [
    { label: 'Toplam Abone', value: counts.all,   tone: 'sea' },
    { label: 'Aktif',        value: counts.aktif, tone: 'emerald' },
    { label: 'Bu Ay',        value: counts.ay,    tone: 'gold' },
    { label: 'Bu Hafta',     value: counts.hafta, tone: 'amber' },
  ]

  const exportCSV = () => {
    const rows = filtered.map(a => [
      a.email || '',
      a.aktif ? 'Aktif' : 'Pasif',
      new Date(a.created_at).toLocaleDateString('tr-TR'),
    ])
    const header = ['E-posta', 'Durum', 'Kayıt Tarihi']
    const escape = (v) => {
      const s = String(v ?? '')
      return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const csv = [header, ...rows].map(r => r.map(escape).join(';')).join('\r\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `aboneler_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-3">
      {/* KPI'lar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>{k.label}</p>
              <span className={`w-2 h-2 rounded-full ${
                k.tone === 'gold'    ? 'bg-gold-500'    :
                k.tone === 'emerald' ? 'bg-emerald-400' :
                k.tone === 'amber'   ? 'bg-amber-400'   :
                                       'bg-sea-400'
              }`} />
            </div>
            <p className={`text-2xl font-semibold tabular-nums tracking-tight ${isDark ? 'text-cream' : 'text-sea-900'}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {chips.map(c => {
            const active = filter === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition border ${
                  active
                    ? (isDark ? 'bg-sea-800 text-cream border-gold-500/40' : 'bg-sea-900 text-cream border-sea-900')
                    : (isDark ? 'border-gold-500/15 text-cream/65 hover:border-gold-500/40' : 'border-gold-300/40 text-mute hover:border-gold-500')
                }`}
              >
                {c.label}
                <span className={`tabular-nums ${active ? 'opacity-85' : 'opacity-65'}`}>{counts[c.id] || 0}</span>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <div className={`relative ${isDark ? '' : ''}`}>
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDark ? 'text-cream/45' : 'text-mute'}`} strokeWidth={1.8} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="E-posta ara…"
              className={`pl-9 pr-3 py-1.5 rounded-lg text-[12px] border outline-none transition ${
                isDark
                  ? 'bg-sea-900/70 border-gold-500/15 text-cream placeholder-cream/40 focus:border-gold-500/40'
                  : 'bg-cream border-gold-300/40 text-sea-900 placeholder-mute focus:border-gold-500'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold border transition disabled:opacity-40 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-sea-800 border-gold-500/30 text-cream hover:border-gold-500/60'
                : 'bg-cream border-gold-400 text-sea-900 hover:border-gold-600'
            }`}
            title="CSV olarak indir"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.8} />
            CSV Dışa Aktar
          </button>
        </div>
      </div>

      {/* Tablo */}
      <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl overflow-hidden`}>
        {pageItems.length === 0 ? (
          <div className={`px-5 py-14 text-center ${isDark ? 'text-cream/55' : 'text-mute'}`}>
            <AtSign className="w-8 h-8 mx-auto mb-3 opacity-60" strokeWidth={1.4} />
            <p className="text-sm">{q || filter !== 'all' ? 'Bu kriterde abone yok' : 'Henüz abone yok'}</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className={`grid grid-cols-12 gap-3 px-5 py-2.5 text-[10px] tracking-[0.22em] uppercase font-semibold border-b ${
              isDark ? 'text-gold-300/70 border-gold-500/10 bg-sea-900/40' : 'text-gold-700 border-gold-300/30 bg-sand-50/40'
            }`}>
              <div className="col-span-6">E-posta</div>
              <div className="col-span-2">Durum</div>
              <div className="col-span-3">Kayıt Tarihi</div>
              <div className="col-span-1 text-right">İşlem</div>
            </div>
            {/* Rows */}
            {pageItems.map(a => {
              const initial = (a.email || '?')[0]?.toUpperCase() || '?'
              return (
                <div
                  key={a.id}
                  className={`grid grid-cols-12 gap-3 px-5 py-3 items-center border-b last:border-0 transition ${
                    isDark ? 'border-gold-500/10 hover:bg-sea-800/30' : 'border-gold-300/20 hover:bg-sand-50/60'
                  }`}
                >
                  {/* E-posta */}
                  <div className="col-span-6 flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${a.aktif ? 'bg-gold-500 text-sea-900' : (isDark ? 'bg-sea-700 text-cream/55' : 'bg-gold-500/15 text-gold-700')}`}>
                      {initial}
                    </div>
                    <a
                      href={`mailto:${a.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`text-sm font-medium truncate transition ${isDark ? 'text-cream hover:text-gold-300' : 'text-sea-900 hover:text-gold-700'}`}
                      title={a.email}
                    >
                      {a.email}
                    </a>
                  </div>
                  {/* Durum */}
                  <div className="col-span-2">
                    {a.aktif ? (
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] tracking-[0.18em] uppercase font-bold ${isDark ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Aktif
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] tracking-[0.18em] uppercase font-bold ${isDark ? 'bg-sea-800 text-cream/55 border border-gold-500/15' : 'bg-sand-100 text-mute border border-gold-300/40'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-mute" />
                        Pasif
                      </span>
                    )}
                  </div>
                  {/* Tarih */}
                  <div className={`col-span-3 text-[12px] tabular-nums ${isDark ? 'text-cream/75' : 'text-sea-900/85'}`}>
                    {new Date(a.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    <span className={`block text-[10px] ${isDark ? 'text-cream/45' : 'text-mute'}`}>{timeAgo(new Date(a.created_at))}</span>
                  </div>
                  {/* Aksiyon */}
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onToggle(a)}
                      aria-label={a.aktif ? 'Pasif yap' : 'Aktif yap'}
                      title={a.aktif ? 'Pasif yap' : 'Aktif yap'}
                      className={`w-7 h-7 rounded-md flex items-center justify-center transition ${
                        a.aktif
                          ? (isDark ? 'text-emerald-300 hover:bg-amber-500/15 hover:text-amber-300' : 'text-emerald-700 hover:bg-amber-50 hover:text-amber-700')
                          : (isDark ? 'text-cream/45 hover:bg-emerald-500/15 hover:text-emerald-300' : 'text-mute hover:bg-emerald-50 hover:text-emerald-700')
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(a)}
                      aria-label="Sil"
                      title="Sil"
                      className={`w-7 h-7 rounded-md flex items-center justify-center transition ${isDark ? 'text-cream/55 hover:text-rose-300 hover:bg-rose-500/10' : 'text-mute hover:text-rose-600 hover:bg-rose-50'}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              )
            })}
            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`px-5 py-3 flex items-center justify-between border-t ${isDark ? 'border-gold-500/10 bg-sea-900/40' : 'border-gold-300/30 bg-sand-50/40'}`}>
                <p className={`text-[11px] ${isDark ? 'text-cream/55' : 'text-mute'}`}>
                  <span className="tabular-nums">{(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)}</span> / <span className="tabular-nums">{filtered.length}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className={`w-7 h-7 rounded-md flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'text-cream/65 hover:bg-sea-800/50' : 'text-mute hover:bg-sand-100'}`}
                  >
                    <ChevronLeft className="w-4 h-4" strokeWidth={1.8} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let n
                    if (totalPages <= 5) n = i + 1
                    else if (safePage <= 3) n = i + 1
                    else if (safePage >= totalPages - 2) n = totalPages - 4 + i
                    else n = safePage - 2 + i
                    const active = n === safePage
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCurrentPage(n)}
                        className={`min-w-[28px] h-7 px-2 rounded-md text-[11px] font-semibold tabular-nums transition ${
                          active
                            ? (isDark ? 'bg-gold-500 text-sea-900' : 'bg-sea-900 text-cream')
                            : (isDark ? 'text-cream/65 hover:bg-sea-800/50' : 'text-mute hover:bg-sand-100')
                        }`}
                      >
                        {n}
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className={`w-7 h-7 rounded-md flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'text-cream/65 hover:bg-sea-800/50' : 'text-mute hover:bg-sand-100'}`}
                  >
                    <ChevronRight className="w-4 h-4" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ============================================================ */
/* GALERI                                                        */
/* ============================================================ */
const GALERI_SLOTS = [
  { key: 'hero',            label: 'Anasayfa Hero' },
  { key: 'karsilama',       label: 'Karşılama' },
  { key: 'konfor_bg',       label: 'Konfor BG' },
  { key: 'yatak_odasi',     label: 'Yatak Odası' },
  { key: 'suite_detay',     label: 'Suite Detay' },
  { key: 'cocuk_odasi',     label: 'Çocuk Odası' },
  { key: 'manzara_bg',      label: 'Manzara BG' },
  { key: 'hakkimizda_bg',   label: 'Hakkımızda BG' },
  { key: 'galeri_hero',     label: 'Galeri Hero' },
  { key: 'ozellikler_hero', label: 'Özellikler Hero' },
  { key: 'yorumlar_hero',   label: 'Yorumlar Hero' },
  { key: 'iletisim_hero',   label: 'İletişim Hero' },
]
const slotLabel = (key) => GALERI_SLOTS.find(s => s.key === key)?.label || ''

function Galeri({ isDark, fotolar, uploadLoading, onUpload, onUpdate, onToggle, onDelete, onMove, onSlotToggle }) {
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editBaslik, setEditBaslik] = useState('')

  const sorted = [...fotolar].sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0))
  const matches = (f, key) => {
    if (key === 'all')   return true
    if (key === 'aktif') return !!f.aktif
    if (key === 'pasif') return !f.aktif
    return true
  }
  const counts = {
    all:   fotolar.length,
    aktif: fotolar.filter(f => f.aktif).length,
    pasif: fotolar.filter(f => !f.aktif).length,
  }
  const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0)
  const buAy = fotolar.filter(f => new Date(f.created_at) >= startOfMonth).length

  const filtered = sorted.filter(f => matches(f, filter))

  const chips = [
    { id: 'all',   label: 'Tümü' },
    { id: 'aktif', label: 'Aktif' },
    { id: 'pasif', label: 'Pasif' },
  ]

  const kpis = [
    { label: 'Toplam Foto', value: counts.all,   tone: 'sea' },
    { label: 'Aktif',       value: counts.aktif, tone: 'emerald' },
    { label: 'Pasif',       value: counts.pasif, tone: 'amber' },
    { label: 'Bu Ay',       value: buAy,         tone: 'gold' },
  ]

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(file)
      e.target.value = ''
    }
  }

  const startEdit = (f) => {
    setEditingId(f.id)
    setEditBaslik(f.baslik || '')
  }
  const saveEdit = (f) => {
    if (editBaslik.trim() !== (f.baslik || '').trim()) {
      onUpdate(f, { baslik: editBaslik.trim() })
    }
    setEditingId(null)
  }

  return (
    <div className="space-y-3">
      {/* KPI'lar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => (
          <div key={i} className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>{k.label}</p>
              <span className={`w-2 h-2 rounded-full ${
                k.tone === 'gold'    ? 'bg-gold-500'    :
                k.tone === 'emerald' ? 'bg-emerald-400' :
                k.tone === 'amber'   ? 'bg-amber-400'   :
                                       'bg-sea-400'
              }`} />
            </div>
            <p className={`text-2xl font-semibold tabular-nums tracking-tight ${isDark ? 'text-cream' : 'text-sea-900'}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {chips.map(c => {
            const active = filter === c.id
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition border ${
                  active
                    ? (isDark ? 'bg-sea-800 text-cream border-gold-500/40' : 'bg-sea-900 text-cream border-sea-900')
                    : (isDark ? 'border-gold-500/15 text-cream/65 hover:border-gold-500/40' : 'border-gold-300/40 text-mute hover:border-gold-500')
                }`}
              >
                {c.label}
                <span className={`tabular-nums ${active ? 'opacity-85' : 'opacity-65'}`}>{counts[c.id] || 0}</span>
              </button>
            )
          })}
        </div>
        <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-semibold cursor-pointer transition ${
          uploadLoading
            ? 'bg-gold-500/40 text-sea-900 cursor-wait'
            : 'bg-gold-500 hover:bg-gold-300 text-sea-900'
        }`}>
          {uploadLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-sea-900/30 border-t-sea-900 rounded-full animate-spin" />
              Yükleniyor…
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" strokeWidth={2} />
              Yeni Foto Yükle
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploadLoading}
            className="hidden"
          />
        </label>
      </div>

      {/* Foto grid */}
      {filtered.length === 0 ? (
        <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15 text-cream/55' : 'bg-cream border-gold-300/40 text-mute'} border rounded-xl px-5 py-14 text-center`}>
          <ImageIcon className="w-8 h-8 mx-auto mb-3 opacity-60" strokeWidth={1.4} />
          <p className="text-sm">{filter !== 'all' ? 'Bu filtrede foto yok' : 'Henüz foto yüklenmemiş'}</p>
          {filter === 'all' && (
            <p className="text-[11px] mt-1 opacity-70">Sağ üstteki "Yeni Foto Yükle" butonuyla başla.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((f, i) => {
            const allIdx = sorted.findIndex(x => x.id === f.id)
            const isFirst = allIdx === 0
            const isLast = allIdx === sorted.length - 1
            const isEditing = editingId === f.id
            return (
              <div
                key={f.id}
                className={`group relative border-2 rounded-xl overflow-hidden transition ${
                  f.one_cikan
                    ? 'border-gold-500 shadow-[0_0_0_4px_rgba(212,175,55,0.12)]'
                    : (isDark
                        ? `bg-sea-900/70 ${f.aktif ? 'border-gold-500/15 hover:border-gold-500/35' : 'border-gold-500/10 opacity-60 hover:opacity-100'}`
                        : `bg-cream ${f.aktif ? 'border-gold-300/40 hover:border-gold-500' : 'border-gold-300/30 opacity-60 hover:opacity-100'}`)
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[3/2] bg-sea-900/10 overflow-hidden">
                  {f.image_url ? (
                    <img
                      src={f.image_url}
                      alt={f.baslik || 'Foto'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-mute">
                      <ImageIcon className="w-10 h-10 opacity-40" strokeWidth={1.2} />
                    </div>
                  )}

                  {/* Sıra rozeti */}
                  <span className={`absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] tracking-[0.18em] uppercase font-bold backdrop-blur-md ${isDark ? 'bg-sea-900/70 text-cream border border-gold-500/30' : 'bg-cream/85 text-sea-900 border border-gold-400/40'}`}>
                    <GripVertical className="w-3 h-3 opacity-60" strokeWidth={2} />
                    {allIdx + 1}
                  </span>

                  {/* Sağ üst — durum + slot rozetleri */}
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 max-w-[80%] flex-wrap justify-end">
                    {!f.aktif && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] tracking-[0.18em] uppercase font-bold backdrop-blur-md ${isDark ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40' : 'bg-amber-100 text-amber-800 border border-amber-300'}`}>
                        Pasif
                      </span>
                    )}
                    {(f.kullanim_yerleri || []).slice(0, 2).map(k => (
                      <span key={k} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] tracking-[0.18em] uppercase font-bold bg-gold-500 text-sea-900">
                        <Star className="w-3 h-3 fill-sea-900" strokeWidth={2} />
                        {slotLabel(k)}
                      </span>
                    ))}
                    {(f.kullanim_yerleri || []).length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] tracking-[0.18em] uppercase font-bold bg-gold-500 text-sea-900">
                        +{(f.kullanim_yerleri || []).length - 2}
                      </span>
                    )}
                  </div>

                  {/* Reorder controls — bottom right of image */}
                  <div className="absolute bottom-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      type="button"
                      onClick={() => onMove(f, 'up')}
                      disabled={isFirst}
                      aria-label="Yukarı taşı"
                      title="Yukarı taşı"
                      className={`w-7 h-7 rounded-md flex items-center justify-center backdrop-blur-md transition disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'bg-sea-900/70 text-cream hover:bg-sea-800 border border-gold-500/30' : 'bg-cream/85 text-sea-900 hover:bg-cream border border-gold-400/40'}`}
                    >
                      <ChevronUp className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onMove(f, 'down')}
                      disabled={isLast}
                      aria-label="Aşağı taşı"
                      title="Aşağı taşı"
                      className={`w-7 h-7 rounded-md flex items-center justify-center backdrop-blur-md transition disabled:opacity-30 disabled:cursor-not-allowed ${isDark ? 'bg-sea-900/70 text-cream hover:bg-sea-800 border border-gold-500/30' : 'bg-cream/85 text-sea-900 hover:bg-cream border border-gold-400/40'}`}
                    >
                      <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </div>
                </div>

                {/* Meta */}
                <div className="p-3">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editBaslik}
                        onChange={(e) => setEditBaslik(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(f); if (e.key === 'Escape') setEditingId(null) }}
                        autoFocus
                        className={`flex-1 min-w-0 px-2 py-1 rounded-md text-[12px] border outline-none ${
                          isDark
                            ? 'bg-sea-800 border-gold-500/30 text-cream focus:border-gold-500/60'
                            : 'bg-white border-gold-300 text-sea-900 focus:border-gold-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(f)}
                        aria-label="Kaydet"
                        className="w-7 h-7 rounded-md flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        aria-label="İptal"
                        className={`w-7 h-7 rounded-md flex items-center justify-center ${isDark ? 'text-cream/55 hover:bg-sea-800/50' : 'text-mute hover:bg-sand-50'}`}
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <p className={`flex-1 min-w-0 truncate text-[13px] font-medium ${isDark ? 'text-cream' : 'text-sea-900'}`} title={f.baslik}>
                        {f.baslik || <span className="opacity-50 italic">başlıksız</span>}
                      </p>
                      <button
                        type="button"
                        onClick={() => startEdit(f)}
                        aria-label="Başlığı düzenle"
                        title="Başlığı düzenle"
                        className={`w-7 h-7 rounded-md flex items-center justify-center transition ${isDark ? 'text-cream/55 hover:text-gold-300 hover:bg-sea-800/50' : 'text-mute hover:text-gold-700 hover:bg-gold-50'}`}
                      >
                        <Pencil className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggle(f)}
                        aria-label={f.aktif ? 'Pasif yap' : 'Aktif yap'}
                        title={f.aktif ? 'Pasif yap' : 'Aktif yap'}
                        className={`w-7 h-7 rounded-md flex items-center justify-center transition ${
                          f.aktif
                            ? (isDark ? 'text-emerald-300 hover:bg-amber-500/15 hover:text-amber-300' : 'text-emerald-700 hover:bg-amber-50 hover:text-amber-700')
                            : (isDark ? 'text-cream/45 hover:bg-emerald-500/15 hover:text-emerald-300' : 'text-mute hover:bg-emerald-50 hover:text-emerald-700')
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(f)}
                        aria-label="Sil"
                        title="Sil"
                        className={`w-7 h-7 rounded-md flex items-center justify-center transition ${isDark ? 'text-cream/55 hover:text-rose-300 hover:bg-rose-500/10' : 'text-mute hover:text-rose-600 hover:bg-rose-50'}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                      </button>
                    </div>
                  )}

                  {/* Slot çoklu chip toggle */}
                  <div className="mt-2">
                    <p className={`text-[10px] tracking-[0.22em] uppercase font-semibold mb-1.5 ${isDark ? 'text-gold-300/70' : 'text-gold-700'}`}>Kullanım Alanları</p>
                    <div className="flex flex-wrap gap-1">
                      {GALERI_SLOTS.map(s => {
                        const active = (f.kullanim_yerleri || []).includes(s.key)
                        return (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => onSlotToggle(f, s.key)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide transition border ${
                              active
                                ? 'bg-gold-500 border-gold-500 text-sea-900 hover:bg-gold-300'
                                : (isDark
                                    ? 'bg-sea-800/40 border-gold-500/20 text-cream/65 hover:border-gold-500/50 hover:text-cream'
                                    : 'bg-white border-gold-300/50 text-mute hover:border-gold-500 hover:text-sea-900')
                            }`}
                          >
                            {s.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ============================================================ */
/* PLACEHOLDER FOR OTHER TABS                                    */
/* ============================================================ */
function ComingSoon({ isDark, label }) {
  return (
    <div className={`${isDark ? 'bg-sea-900/70 border-gold-500/15' : 'bg-cream border-gold-300/40'} border rounded-xl p-12 text-center`}>
      <p className={`text-[10px] tracking-[0.28em] uppercase font-semibold ${isDark ? 'text-gold-300/80' : 'text-gold-600'}`}>Yakında</p>
      <h3 className={`font-display text-3xl font-light mt-2 ${isDark ? 'text-cream' : 'text-sea-900'}`}>{label}</h3>
      <p className={`mt-3 text-sm ${isDark ? 'text-cream/65' : 'text-mute'}`}>Bu bölüm yakında eklenecek.</p>
    </div>
  )
}

/* ============================================================ */
/* MAIN PAGE                                                     */
/* ============================================================ */
export default function AdminDashboard() {
  const [isDark, setIsDark] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [rezervasyonlar, setRezervasyonlar] = useState([])
  const [mesajlar, setMesajlar] = useState([])
  const [yorumlar, setYorumlar] = useState([])
  const [galeriFotolar, setGaleriFotolar] = useState([])
  const [abone, setAbone] = useState([])
  const [loading, setLoading] = useState(true)
  const [quickActionLoading, setQuickActionLoading] = useState(null)
  const [monthlyData, setMonthlyData] = useState([])
  const [occupancyData, setOccupancyData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [upcomingList, setUpcomingList] = useState([])
  const [fiyatlar, setFiyatlar] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('adminAuth')) {
      localStorage.setItem('adminAuth', 'true')
    }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [rezRes, msgRes, yorRes, galRes, abnRes, fytRes] = await Promise.all([
        supabase.from('rezervasyonlar').select('*').order('created_at', { ascending: false }),
        supabase.from('iletisim_mesajlari').select('*').order('created_at', { ascending: false }),
        supabase.from('yorumlar').select('*').order('created_at', { ascending: false }),
        supabase.from('galeri').select('*').order('sira', { ascending: true }),
        supabase.from('newsletter_aboneler').select('*').order('created_at', { ascending: false }),
        supabase.from('fiyat_ayarlari').select('*').order('created_at', { ascending: false }),
      ])
      const rez = rezRes.data || []
      setRezervasyonlar(rez)
      setMesajlar(msgRes.data || [])
      setYorumlar(yorRes.data || [])
      setGaleriFotolar(galRes.data || [])
      setAbone(abnRes.data || [])
      setFiyatlar(fytRes.data || [])

      /* Monthly aggregation for the area chart */
      const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']
      const now = new Date()
      const buckets = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
        return { ay: months[d.getMonth()], rezervasyon: 0, m: d.getMonth(), y: d.getFullYear() }
      })
      rez.forEach((r) => {
        if (r.durum === 'onaylandi' || r.durum === 'onaylandı') {
          const d = new Date(r.created_at || r.giris_tarihi)
          const b = buckets.find(x => x.m === d.getMonth() && x.y === d.getFullYear())
          if (b) b.rezervasyon += (r.toplam_fiyat || 0)
        }
      })
      setMonthlyData(buckets.map(({ ay, rezervasyon }) => ({ ay, rezervasyon })))

      /* === Aylık doluluk oranı (son 6 ay) === */
      const occBuckets = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
        const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
        return { ay: months[d.getMonth()], dolu: 0, days, m: d.getMonth(), y: d.getFullYear() }
      })
      rez.forEach((r) => {
        if (r.durum !== 'onaylandi' && r.durum !== 'onaylandı') return
        const start = new Date(r.giris_tarihi)
        const end   = new Date(r.cikis_tarihi)
        for (let day = new Date(start); day < end; day.setDate(day.getDate() + 1)) {
          const b = occBuckets.find(x => x.m === day.getMonth() && x.y === day.getFullYear())
          if (b) b.dolu += 1
        }
      })
      setOccupancyData(occBuckets.map(({ ay, dolu, days }) => ({ ay, oran: Math.min(100, Math.round((dolu / days) * 100)) })))

      /* === Rezervasyon durumu (son 90 gün) === */
      const ninetyAgo = new Date(Date.now() - 90 * 86400000)
      const recent = rez.filter(r => new Date(r.created_at || r.giris_tarihi) >= ninetyAgo)
      const cnt = (key) => recent.filter(r => r.durum === key || (key === 'onaylandi' && r.durum === 'onaylandı')).length
      setStatusData([
        { name: 'Onaylandı',    value: cnt('onaylandi'),                    color: '#10B981' },
        { name: 'Beklemede',    value: cnt('beklemede'),                    color: '#C99060' },
        { name: 'İptal edildi', value: cnt('iptal') + cnt('iptal_edildi'),  color: '#F43F5E' },
        { name: 'Reddedildi',   value: cnt('reddedildi'),                   color: '#6B6B6B' },
      ])

      /* === Yaklaşan girişler === */
      setUpcomingList(
        rez
          .filter(r => new Date(r.giris_tarihi) > new Date() && (r.durum === 'onaylandi' || r.durum === 'onaylandı' || r.durum === 'beklemede'))
          .sort((a, b) => new Date(a.giris_tarihi) - new Date(b.giris_tarihi))
          .slice(0, 4)
      )
    } catch (err) {
      console.warn('loadData hatası:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickApprove = async (rez) => {
    try {
      setQuickActionLoading(rez.id)
      await supabase.from('rezervasyonlar').update({ durum: 'onaylandi' }).eq('id', rez.id)
      await loadData()
    } catch (e) {
      console.warn(e)
    } finally {
      setQuickActionLoading(null)
    }
  }
  const handleQuickReject = async (rez) => {
    try {
      setQuickActionLoading(rez.id)
      await supabase.from('rezervasyonlar').update({ durum: 'reddedildi' }).eq('id', rez.id)
      await loadData()
    } catch (e) {
      console.warn(e)
    } finally {
      setQuickActionLoading(null)
    }
  }
  /* === Mesaj handlers === */
  const handleMesajRead = async (m, okundu = true) => {
    try {
      await supabase.from('iletisim_mesajlari').update({ okundu }).eq('id', m.id)
      await loadData()
    } catch (e) { console.warn('Mesaj okundu:', e) }
  }
  const handleMesajDelete = async (m) => {
    if (!window.confirm(`"${m.ad_soyad || m.ad || 'Bu kişi'}" mesajını silmek istediğinize emin misiniz?`)) return
    try {
      await supabase.from('iletisim_mesajlari').delete().eq('id', m.id)
      await loadData()
    } catch (e) { console.warn('Mesaj sil:', e) }
  }
  /* === Yorum handlers === */
  const handleYorumApprove = async (y) => {
    try {
      await supabase.from('yorumlar').update({ onaylandi: true }).eq('id', y.id)
      await loadData()
    } catch (e) { console.warn('Yorum onayla:', e) }
  }
  const handleYorumReject = async (y) => {
    try {
      await supabase.from('yorumlar').update({ onaylandi: false }).eq('id', y.id)
      await loadData()
    } catch (e) { console.warn('Yorum reddet:', e) }
  }
  const handleYorumDelete = async (y) => {
    if (!window.confirm(`"${y.ad || 'Bu yorum'}" yorumunu silmek istediğinize emin misiniz?`)) return
    try {
      await supabase.from('yorumlar').delete().eq('id', y.id)
      await loadData()
    } catch (e) { console.warn('Yorum sil:', e) }
  }
  /* === Foto handlers === */
  const [fotoUploadLoading, setFotoUploadLoading] = useState(false)
  const handleFotoUpload = async (file) => {
    if (!file) return
    try {
      setFotoUploadLoading(true)
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const filePath = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: upErr } = await supabase.storage.from('galeri').upload(filePath, file, { cacheControl: '3600', upsert: false })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('galeri').getPublicUrl(filePath)
      const url = urlData?.publicUrl
      if (!url) throw new Error('Public URL alınamadı')
      const { error: dbErr } = await supabase.from('galeri').insert({
        image_url: url,
        baslik: file.name.replace(/\.[^.]+$/, ''),
        aciklama: '',
        sira: galeriFotolar.length,
        aktif: true,
      })
      if (dbErr) throw dbErr
      await loadData()
    } catch (e) {
      console.error('Foto yükle:', e)
      alert('Foto yüklenemedi: ' + (e.message || e))
    } finally {
      setFotoUploadLoading(false)
    }
  }
  const handleFotoUpdate = async (f, fields) => {
    try {
      await supabase.from('galeri').update(fields).eq('id', f.id)
      await loadData()
    } catch (e) { console.warn('Foto güncelle:', e) }
  }
  const handleFotoToggle = async (f) => {
    try {
      await supabase.from('galeri').update({ aktif: !f.aktif }).eq('id', f.id)
      await loadData()
    } catch (e) { console.warn('Foto toggle:', e) }
  }
  const handleFotoDelete = async (f) => {
    if (!window.confirm(`"${f.baslik || 'Bu fotoğrafı'}" silmek istediğinize emin misiniz?`)) return
    try {
      const filePath = (f.image_url || '').split('/').pop()
      if (filePath) {
        try { await supabase.storage.from('galeri').remove([filePath]) } catch (se) { console.warn('Storage sil:', se) }
      }
      await supabase.from('galeri').delete().eq('id', f.id)
      await loadData()
    } catch (e) { console.warn('Foto sil:', e) }
  }
  const handleFotoSlotToggle = async (f, slotKey) => {
    try {
      const current = f.kullanim_yerleri || []
      const next = current.includes(slotKey)
        ? current.filter(k => k !== slotKey)
        : [...current, slotKey]
      await supabase.from('galeri').update({ kullanim_yerleri: next.length ? next : null }).eq('id', f.id)
      await loadData()
    } catch (e) { console.warn('Slot toggle:', e) }
  }
  const handleFotoMove = async (f, dir) => {
    const sorted = [...galeriFotolar].sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0))
    const idx = sorted.findIndex(x => x.id === f.id)
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= sorted.length) return
    const other = sorted[targetIdx]
    try {
      await Promise.all([
        supabase.from('galeri').update({ sira: other.sira }).eq('id', f.id),
        supabase.from('galeri').update({ sira: f.sira }).eq('id', other.id),
      ])
      await loadData()
    } catch (e) { console.warn('Foto sıra:', e) }
  }

  /* === Abone handlers === */
  const handleAboneToggle = async (a) => {
    try {
      await supabase.from('newsletter_aboneler').update({ aktif: !a.aktif }).eq('id', a.id)
      await loadData()
    } catch (e) { console.warn('Abone toggle:', e) }
  }
  const handleAboneDelete = async (a) => {
    if (!window.confirm(`"${a.email}" abonesini silmek istediğinize emin misiniz?`)) return
    try {
      await supabase.from('newsletter_aboneler').delete().eq('id', a.id)
      await loadData()
    } catch (e) { console.warn('Abone sil:', e) }
  }

  const handleLogout = async () => {
    try { await fetch('/api/admin/logout', { method: 'POST' }) } catch {}
    localStorage.removeItem('adminAuth')
    window.location.replace('/admin/login')
  }

  const badges = {
    rez: rezervasyonlar.filter(r => r.durum === 'beklemede').length,
    msg: mesajlar.filter(m => !m.okundu).length,
    yor: yorumlar.filter(y => !y.onaylandi).length,
    nl:  abone.length,
    gal: galeriFotolar.length,
  }

  /* Activity feed – tüm tablolardan birleşik kronolojik akış */
  const activityFeed = useMemo(() => {
    const events = []
    rezervasyonlar.forEach((r) => {
      const isApproved = r.durum === 'onaylandi' || r.durum === 'onaylandı'
      const isRejected = r.durum === 'reddedildi'
      events.push({
        id: `rez-${r.id}`,
        Icon: isApproved ? CalendarCheck : isRejected ? X : Hourglass,
        tone: isApproved ? 'emerald' : isRejected ? 'rose' : 'amber',
        title: isApproved ? 'Rezervasyon onaylandı' : isRejected ? 'Rezervasyon reddedildi' : 'Yeni rezervasyon talebi',
        detail: `${r.ad || ''} ${r.soyad || ''} · ${formatTL(r.toplam_fiyat)}`,
        at: new Date(r.created_at || r.giris_tarihi),
      })
    })
    mesajlar.forEach((m) => {
      events.push({
        id: `msg-${m.id}`,
        Icon: MessageCircle,
        tone: 'default',
        title: 'Yeni mesaj',
        detail: `${m.ad_soyad || m.ad || 'Misafir'}${m.konu ? ' · ' + m.konu : ''}`,
        at: new Date(m.created_at),
      })
    })
    yorumlar.forEach((y) => {
      events.push({
        id: `yor-${y.id}`,
        Icon: Star,
        tone: y.onaylandi ? 'emerald' : 'gold',
        title: y.onaylandi ? 'Yorum onaylandı' : 'Yeni yorum',
        detail: `${y.ad || 'Misafir'}${y.puan ? ' · ★ ' + y.puan : ''}`,
        at: new Date(y.created_at),
      })
    })
    abone.forEach((a) => {
      events.push({
        id: `abn-${a.id}`,
        Icon: Mail,
        tone: 'gold',
        title: 'Yeni newsletter abonesi',
        detail: a.email || '',
        at: new Date(a.created_at),
      })
    })
    return events
      .filter(e => e.at && !isNaN(e.at.getTime()))
      .sort((a, b) => b.at - a.at)
      .slice(0, 7)
  }, [rezervasyonlar, mesajlar, yorumlar, abone])
  const tabLabels = {
    dashboard: 'Genel Bakış',
    rezervasyonlar: 'Rezervasyonlar',
    takvim: 'Takvim',
    fiyatlandirma: 'Fiyatlandırma',
    istatistikler: 'İstatistikler',
    mesajlar: 'Mesajlar',
    yorumlar: 'Yorumlar',
    newsletter: 'Newsletter',
    galeri: 'Galeri',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-sea-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-2 border-gold-500/20 border-t-gold-500 inline-block" />
          <p className="mt-6 text-[11px] tracking-[0.32em] uppercase text-gold-300 font-medium">Yükleniyor</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-sea-900' : 'bg-cream'}`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        badges={badges}
        onLogout={handleLogout}
      />
      <main className="ml-60">
        <TopBar
          isDark={isDark}
          pageTitle={tabLabels[activeTab] || 'Dashboard'}
          pendingCount={badges.rez}
          unreadCount={badges.msg}
          onPendingClick={() => setActiveTab('rezervasyonlar')}
        />
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <DashboardHome
              isDark={isDark}
              rezervasyonlar={rezervasyonlar}
              mesajlar={mesajlar}
              monthlyData={monthlyData}
              occupancyData={occupancyData}
              statusData={statusData}
              upcomingList={upcomingList}
              activityFeed={activityFeed}
              onApprove={handleQuickApprove}
              onReject={handleQuickReject}
              quickActionLoading={quickActionLoading}
              onAllPending={() => setActiveTab('rezervasyonlar')}
              onOpenCalendar={() => setActiveTab('takvim')}
            />
          )}
          {activeTab === 'rezervasyonlar' && (
            <Reservations
              isDark={isDark}
              rezervasyonlar={rezervasyonlar}
              onApprove={handleQuickApprove}
              onReject={handleQuickReject}
              quickActionLoading={quickActionLoading}
            />
          )}
          {activeTab === 'takvim' && (
            <Takvim
              isDark={isDark}
              rezervasyonlar={rezervasyonlar}
            />
          )}
          {activeTab === 'fiyatlandirma' && (
            <Fiyatlandirma isDark={isDark} />
          )}
          {activeTab === 'mesajlar' && (
            <Mesajlar
              isDark={isDark}
              mesajlar={mesajlar}
              onRead={handleMesajRead}
              onDelete={handleMesajDelete}
            />
          )}
          {activeTab === 'yorumlar' && (
            <Yorumlar
              isDark={isDark}
              yorumlar={yorumlar}
              onApprove={handleYorumApprove}
              onReject={handleYorumReject}
              onDelete={handleYorumDelete}
            />
          )}
          {activeTab === 'newsletter' && (
            <Newsletter
              isDark={isDark}
              abone={abone}
              onToggle={handleAboneToggle}
              onDelete={handleAboneDelete}
            />
          )}
          {activeTab === 'galeri' && (
            <Galeri
              isDark={isDark}
              fotolar={galeriFotolar}
              uploadLoading={fotoUploadLoading}
              onUpload={handleFotoUpload}
              onUpdate={handleFotoUpdate}
              onToggle={handleFotoToggle}
              onDelete={handleFotoDelete}
              onMove={handleFotoMove}
              onSlotToggle={handleFotoSlotToggle}
            />
          )}
          {activeTab !== 'dashboard' && activeTab !== 'rezervasyonlar' && activeTab !== 'takvim' && activeTab !== 'fiyatlandirma' && activeTab !== 'mesajlar' && activeTab !== 'yorumlar' && activeTab !== 'newsletter' && activeTab !== 'galeri' && (
            <ComingSoon isDark={isDark} label={tabLabels[activeTab]} />
          )}
        </div>
      </main>
    </div>
  )
}
