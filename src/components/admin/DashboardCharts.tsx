'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ShoppingCart, DollarSign, School, Package, Users,
  TrendingUp, TrendingDown, Clock, CheckCircle, Truck, AlertCircle,
  ArrowUpRight, ArrowDownRight, Calendar, CreditCard
} from "lucide-react"

interface DashboardData {
  summary: {
    totalOrders: number
    pendingOrders: number
    completedOrders: number
    totalSchools: number
    totalClasses: number
    totalPackages: number
    cancelRequests: number
    todayOrders: number
    totalRevenue: number
    monthlyRevenue: number
    weeklyRevenue: number
    revenueGrowth: string
  }
  ordersByStatus: Array<{ status: string; count: number }>
  schoolStats: Array<{ name: string; orders: number; revenue: number }>
  dailyOrders: Array<{ date: string; orders: number; revenue: number }>
  monthlyOrders: Array<{ month: string; orders: number; revenue: number }>
  recentOrders: Array<{
    id: string
    orderNumber: string
    studentName: string
    parentName: string
    schoolName: string
    className: string
    packageName: string
    totalAmount: number
    status: string
    createdAt: string
  }>
  deliveryStats: {
    inCargo: number
    deliveredToSchool: number
    deliveredByCargo: number
  }
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

const statusLabels: Record<string, string> = {
  NEW: 'Yeni',
  PAYMENT_PENDING: 'Odeme Bekliyor',
  PAYMENT_RECEIVED: 'Odeme Alindi',
  CONFIRMED: 'Onaylandi',
  INVOICED: 'Faturalandi',
  CARGO_SHIPPED: 'Kargoda',
  DELIVERED_TO_SCHOOL: 'Okula Teslim',
  DELIVERED_BY_CARGO: 'Kargo Teslim',
  COMPLETED: 'Tamamlandi',
  CANCELLED: 'Iptal',
  REFUNDED: 'Iade'
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  PAYMENT_PENDING: 'bg-yellow-100 text-yellow-800',
  PAYMENT_RECEIVED: 'bg-green-100 text-green-800',
  CONFIRMED: 'bg-emerald-100 text-emerald-800',
  INVOICED: 'bg-purple-100 text-purple-800',
  CARGO_SHIPPED: 'bg-orange-100 text-orange-800',
  DELIVERED_TO_SCHOOL: 'bg-teal-100 text-teal-800',
  DELIVERED_BY_CARGO: 'bg-cyan-100 text-cyan-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800'
}

const monthNames: Record<string, string> = {
  '01': 'Oca', '02': 'Sub', '03': 'Mar', '04': 'Nis',
  '05': 'May', '06': 'Haz', '07': 'Tem', '08': 'Agu',
  '09': 'Eyl', '10': 'Eki', '11': 'Kas', '12': 'Ara'
}

export default function DashboardCharts() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard', { credentials: 'include' })
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Veriler yuklenemedi</p>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    return `${monthNames[month]} ${year.slice(2)}`
  }

  const isPositiveGrowth = parseFloat(data.summary.revenueGrowth) >= 0

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Ciro</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(data.summary.totalRevenue)}
                </p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveGrowth ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{data.summary.revenueGrowth}% bu ay</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Toplam Siparis</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.totalOrders}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="text-blue-600 font-medium">{data.summary.todayOrders}</span> bugun
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Bekleyen</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.pendingOrders}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <span className="text-red-600 font-medium">{data.summary.cancelRequests}</span> iptal talebi
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Orders */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Tamamlanan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.summary.completedOrders}</p>
                <p className="text-sm text-gray-500 mt-2">
                  %{data.summary.totalOrders > 0 ? ((data.summary.completedOrders / data.summary.totalOrders) * 100).toFixed(0) : 0} basari
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <School className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aktif Okul</p>
                <p className="text-xl font-bold">{data.summary.totalSchools}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Toplam Sinif</p>
                <p className="text-xl font-bold">{data.summary.totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Aktif Paket</p>
                <p className="text-xl font-bold">{data.summary.totalPackages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Kargoda</p>
                <p className="text-xl font-bold">{data.deliveryStats.inCargo}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Ciro Grafigi</CardTitle>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    activeTab === 'daily'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Gunluk
                </button>
                <button
                  onClick={() => setActiveTab('monthly')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    activeTab === 'monthly'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  Aylik
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeTab === 'daily' ? data.dailyOrders : data.monthlyOrders}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey={activeTab === 'daily' ? 'date' : 'month'}
                    tickFormatter={activeTab === 'daily' ? formatDate : formatMonth}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'Ciro']}
                    labelFormatter={activeTab === 'daily' ? formatDate : formatMonth}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Count Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Siparis Sayisi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeTab === 'daily' ? data.dailyOrders : data.monthlyOrders}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey={activeTab === 'daily' ? 'date' : 'month'}
                    tickFormatter={activeTab === 'daily' ? formatDate : formatMonth}
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    formatter={(value: number) => [value, 'Siparis']}
                    labelFormatter={activeTab === 'daily' ? formatDate : formatMonth}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Bar dataKey="orders" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Pie Charts and School Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Siparis Durumlari</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.ordersByStatus.filter(s => s.count > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="status"
                  >
                    {data.ordersByStatus.map((entry, index) => (
                      <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [value, statusLabels[name] || name]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {data.ordersByStatus.filter(s => s.count > 0).slice(0, 5).map((item, index) => (
                <div key={item.status} className="flex items-center gap-1.5 text-xs">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600">{statusLabels[item.status]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* School Performance */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Okul Bazli Performans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.schoolStats.slice(0, 5)}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                  <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    stroke="#9CA3AF"
                    fontSize={12}
                    tickFormatter={(value) => value.length > 15 ? value.slice(0, 15) + '...' : value}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Ciro' : 'Siparis'
                    ]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  />
                  <Bar dataKey="orders" fill="#3B82F6" name="orders" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Son Siparisler</CardTitle>
            <a href="/admin/siparisler" className="text-sm text-blue-600 hover:text-blue-700">
              Tumu →
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Siparis No</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Ogrenci</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Okul / Sinif</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tutar</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Durum</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm text-blue-600">{order.orderNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.studentName}</p>
                        <p className="text-sm text-gray-500">{order.parentName}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-900">{order.schoolName}</p>
                        <p className="text-sm text-gray-500">{order.className}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Kargoda</p>
                <p className="text-3xl font-bold text-orange-900">{data.deliveryStats.inCargo}</p>
                <p className="text-xs text-orange-600">siparis yolda</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100/50 border-teal-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <School className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-teal-700 font-medium">Okula Teslim</p>
                <p className="text-3xl font-bold text-teal-900">{data.deliveryStats.deliveredToSchool}</p>
                <p className="text-xs text-teal-600">siparis teslim edildi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 border-cyan-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-cyan-700 font-medium">Kargo Teslim</p>
                <p className="text-3xl font-bold text-cyan-900">{data.deliveryStats.deliveredByCargo}</p>
                <p className="text-xs text-cyan-600">eve teslim edildi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
