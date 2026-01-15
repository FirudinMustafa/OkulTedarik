"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, User, Clock } from "lucide-react"

interface LogEntry {
  id: string
  userId: string
  userType: string
  action: string
  entity: string
  entityId: string | null
  details: Record<string, unknown> | null
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

const actionLabels: Record<string, string> = {
  LOGIN: "Giris",
  LOGOUT: "Cikis",
  CREATE: "Olusturma",
  UPDATE: "Guncelleme",
  DELETE: "Silme",
  VIEW: "Goruntuleme",
  APPROVE: "Onaylama",
  REJECT: "Reddetme"
}

const entityLabels: Record<string, string> = {
  USER: "Kullanici",
  SCHOOL: "Okul",
  CLASS: "Sinif",
  PACKAGE: "Paket",
  ORDER: "Siparis",
  PAYMENT: "Odeme",
  INVOICE: "Fatura",
  SHIPMENT: "Kargo",
  CANCEL_REQUEST: "Iptal Talebi"
}

const actionColors: Record<string, string> = {
  LOGIN: "bg-green-100 text-green-800",
  LOGOUT: "bg-gray-100 text-gray-800",
  CREATE: "bg-blue-100 text-blue-800",
  UPDATE: "bg-yellow-100 text-yellow-800",
  DELETE: "bg-red-100 text-red-800",
  VIEW: "bg-purple-100 text-purple-800",
  APPROVE: "bg-emerald-100 text-emerald-800",
  REJECT: "bg-orange-100 text-orange-800"
}

export default function LoglarPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState("")
  const [filterEntity, setFilterEntity] = useState("")

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/logs", { credentials: 'include' })
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error("Loglar yuklenemedi:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  const formatDetails = (details: Record<string, unknown> | null) => {
    if (!details) return "-"
    return Object.entries(details)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ")
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entityId && log.entityId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      formatDetails(log.details).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = !filterAction || log.action === filterAction
    const matchesEntity = !filterEntity || log.entity === filterEntity
    return matchesSearch && matchesAction && matchesEntity
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sistem Loglari</h1>
        <p className="text-gray-500">Tum sistem aktivitelerinin kaydi</p>
      </div>

      {/* Ozet */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Toplam Log
            </CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Giris Islemleri
            </CardTitle>
            <User className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(l => l.action === "LOGIN").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Olusturma
            </CardTitle>
            <Clock className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(l => l.action === "CREATE").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Guncelleme
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.filter(l => l.action === "UPDATE").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Log Listesi */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction || "__all__"} onValueChange={(val) => setFilterAction(val === "__all__" ? "" : val)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Islem tipi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tumu</SelectItem>
                {Object.entries(actionLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterEntity || "__all__"} onValueChange={(val) => setFilterEntity(val === "__all__" ? "" : val)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Varlik tipi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tumu</SelectItem>
                {Object.entries(entityLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Yukleniyor...</div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Log kaydi bulunamadi</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Kullanici</TableHead>
                  <TableHead>Islem</TableHead>
                  <TableHead>Varlik</TableHead>
                  <TableHead>Detaylar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {log.userType}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          {log.userId.slice(0, 8)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={actionColors[log.action] || ""}>
                        {actionLabels[log.action] || log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{entityLabels[log.entity] || log.entity}</p>
                        {log.entityId && (
                          <p className="text-xs text-gray-500 font-mono">
                            {log.entityId.slice(0, 8)}...
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-gray-500">
                      {formatDetails(log.details)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
