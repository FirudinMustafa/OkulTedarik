"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Truck, Package, School, CheckCircle } from "lucide-react"

interface DeliveryOrder {
  id: string
  orderNumber: string
  studentName: string
  parentName: string
  parentPhone: string
  deliveryType: string
  deliveryAddress: string | null
  status: string
  cargoTrackingNumber: string | null
  cargoCompany: string | null
  class: {
    name: string
    school: { id: string; name: string }
  }
}

interface SchoolType {
  id: string
  name: string
}

const statusLabels: Record<string, string> = {
  INVOICED: "Faturalandi",
  CARGO_SHIPPED: "Kargoda",
  DELIVERED_TO_SCHOOL: "Okula Teslim",
  DELIVERED_BY_CARGO: "Teslim Edildi",
  COMPLETED: "Tamamlandi"
}

export default function TeslimatPage() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [schools, setSchools] = useState<SchoolType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSchool, setFilterSchool] = useState("")
  const [filterType, setFilterType] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [ordersRes, schoolsRes] = await Promise.all([
        fetch("/api/admin/deliveries", { credentials: 'include' }),
        fetch("/api/admin/schools", { credentials: 'include' })
      ])

      const [ordersData, schoolsData] = await Promise.all([
        ordersRes.json(),
        schoolsRes.json()
      ])

      setOrders(ordersData.orders || [])
      setSchools(schoolsData.schools || [])
    } catch (error) {
      console.error("Veri yuklenemedi:", error)
    } finally {
      setLoading(false)
    }
  }

  const markDelivered = async (orderId: string, deliveryType: string) => {
    try {
      const newStatus = deliveryType === "CARGO" ? "DELIVERED_BY_CARGO" : "DELIVERED_TO_SCHOOL"

      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      })

      fetchData()
    } catch (error) {
      console.error("Teslim hatasi:", error)
    }
  }

  const markCompleted = async (orderId: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ status: "COMPLETED" })
      })

      fetchData()
    } catch (error) {
      console.error("Tamamlama hatasi:", error)
    }
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.class.school.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSchool = !filterSchool || o.class.school.id === filterSchool
    const matchesType = !filterType || o.deliveryType === filterType
    return matchesSearch && matchesSchool && matchesType
  })

  const cargoOrders = filteredOrders.filter(o => o.deliveryType === "CARGO")
  const schoolOrders = filteredOrders.filter(o => o.deliveryType === "SCHOOL")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teslimat Yonetimi</h1>
        <p className="text-gray-500">Kargo ve okula teslim takibi</p>
      </div>

      {/* Filtreler */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Siparis no veya ogrenci ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterSchool || "__all__"} onValueChange={(val) => setFilterSchool(val === "__all__" ? "" : val)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tum okullar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tum okullar</SelectItem>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterType || "__all__"} onValueChange={(val) => setFilterType(val === "__all__" ? "" : val)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Teslimat tipi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tumu</SelectItem>
                <SelectItem value="CARGO">Kargo</SelectItem>
                <SelectItem value="SCHOOL">Okula Teslim</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Yukleniyor...</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Kargo Teslimatları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                Kargo Teslimatlari ({cargoOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cargoOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Kargo bekleyen siparis yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cargoOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-mono text-sm">{order.orderNumber}</p>
                          <p className="font-medium">{order.studentName}</p>
                          <p className="text-sm text-gray-500">{order.parentName} - {order.parentPhone}</p>
                          {order.deliveryAddress && (
                            <p className="text-sm text-gray-500 mt-1">{order.deliveryAddress}</p>
                          )}
                          {order.cargoTrackingNumber && (
                            <p className="text-sm text-orange-600 mt-1">
                              Takip: {order.cargoTrackingNumber}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline">
                            {statusLabels[order.status] || order.status}
                          </Badge>
                          {order.status === "CARGO_SHIPPED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markDelivered(order.id, "CARGO")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Teslim Edildi
                            </Button>
                          )}
                          {(order.status === "DELIVERED_BY_CARGO" || order.status === "DELIVERED_TO_SCHOOL") && (
                            <Button
                              size="sm"
                              onClick={() => markCompleted(order.id)}
                            >
                              Tamamla
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Okula Teslimler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-blue-500" />
                Okula Teslimler ({schoolOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schoolOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <School className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Okula teslim bekleyen siparis yok</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schoolOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-mono text-sm">{order.orderNumber}</p>
                          <p className="font-medium">{order.studentName}</p>
                          <p className="text-sm text-gray-500">{order.class.school.name} - {order.class.name}</p>
                          <p className="text-sm text-gray-500">{order.parentName} - {order.parentPhone}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline">
                            {statusLabels[order.status] || order.status}
                          </Badge>
                          {order.status === "INVOICED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markDelivered(order.id, "SCHOOL")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Okula Teslim
                            </Button>
                          )}
                          {(order.status === "DELIVERED_BY_CARGO" || order.status === "DELIVERED_TO_SCHOOL") && (
                            <Button
                              size="sm"
                              onClick={() => markCompleted(order.id)}
                            >
                              Tamamla
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
