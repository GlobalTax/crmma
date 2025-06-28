'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Building2, 
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  FileText,
  Handshake,
  DollarSign
} from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'
import { useEffect, useState } from 'react'

export default function CRMPage() {
  const { companies, contacts, opportunities, tasks, fetchCompanies, fetchContacts, fetchOpportunities, fetchTasks } = useSupabase()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchCompanies(),
        fetchContacts(),
        fetchOpportunities(),
        fetchTasks()
      ])
      setLoading(false)
    }
    loadData()
  }, [fetchCompanies, fetchContacts, fetchOpportunities, fetchTasks])

  if (loading) {
    return <div className="p-6">Cargando...</div>
  }

  const totalCompanies = companies.length
  const _totalContacts = contacts.length
  const totalDeals = opportunities.length
  const _completedTasks = tasks.filter(task => task.status === 'completed').length
  
  // Calcular estadísticas M&A específicas
  const totalDealValue = opportunities.reduce((sum, deal) => sum + (deal.amount || 0), 0)
  const activeDeals = opportunities.filter(deal => deal.status === 'open').length
  const closedDeals = opportunities.filter(deal => deal.stage === 'closed_won').length

  // Función para obtener el badge del stage M&A
  const getStageInfo = (stage: string) => {
    const stageMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ComponentType<{ className?: string }> }> = {
      'sourcing': { label: 'Sourcing', variant: 'outline', icon: Target },
      'initial_contact': { label: 'Contacto Inicial', variant: 'outline', icon: Users },
      'nda': { label: 'NDA', variant: 'secondary', icon: FileText },
      'teaser': { label: 'Teaser', variant: 'secondary', icon: FileText },
      'ioi': { label: 'IOI', variant: 'secondary', icon: Handshake },
      'loi': { label: 'LOI', variant: 'default', icon: FileText },
      'due_diligence': { label: 'Due Diligence', variant: 'default', icon: AlertCircle },
      'spa_negotiation': { label: 'Negociación SPA', variant: 'default', icon: Handshake },
      'closing': { label: 'Closing', variant: 'default', icon: CheckCircle2 },
      'closed_won': { label: 'Cerrado Exitoso', variant: 'default', icon: CheckCircle2 },
      'closed_lost': { label: 'Perdido', variant: 'destructive', icon: AlertCircle },
      'on_hold': { label: 'En Pausa', variant: 'outline', icon: Clock }
    }
    return stageMap[stage] || { label: stage, variant: 'outline' as const, icon: Target }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard M&A</h1>
          <p className="text-muted-foreground">Gestión especializada de operaciones de M&A</p>
        </div>
        <Button>Nuevo Deal M&A</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Target</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              Empresas en pipeline
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">
              De {totalDeals} deals totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Pipeline</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalDealValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              En {activeDeals} deals activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deals Cerrados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedDeals}</div>
            <p className="text-xs text-muted-foreground">
              Transacciones exitosas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deals */}
      <Card>
        <CardHeader>
          <CardTitle>Deals M&A Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.slice(0, 5).map((deal) => {
              const stageInfo = getStageInfo(deal.stage)
              const Icon = stageInfo.icon
              
              return (
                <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{deal.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>${(deal.amount || 0).toLocaleString()}</span>
                      {deal.deal_type && (
                        <Badge variant="outline" className="text-xs">
                          {deal.deal_type === 'acquisition' && 'Adquisición'}
                          {deal.deal_type === 'divestiture' && 'Desinversión'}
                          {deal.deal_type === 'merger' && 'Fusión'}
                          {deal.deal_type === 'joint_venture' && 'Joint Venture'}
                          {deal.deal_type === 'private_equity' && 'Private Equity'}
                          {deal.deal_type === 'debt_financing' && 'Financiación'}
                          {deal.deal_type === 'ipo' && 'IPO'}
                        </Badge>
                      )}
                      {deal.industry_sector && (
                        <span>{deal.industry_sector}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={stageInfo.variant}>
                      <Icon className="h-3 w-3 mr-1" />
                      {stageInfo.label}
                    </Badge>
                    <div className="text-right text-sm">
                      <div className="font-semibold">{deal.probability}%</div>
                      <div className="text-xs text-muted-foreground">probabilidad</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Target Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companies.slice(0, 5).map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{company.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <span>{company.industry}</span>
                    {company.employee_count && (
                      <span>{company.employee_count} empleados</span>
                    )}
                    {company.annual_revenue && (
                      <span>${(company.annual_revenue / 1000000).toFixed(1)}M revenue</span>
                    )}
                  </div>
                </div>
                <Badge variant={
                  company.status === 'active' ? 'default' :
                  company.status === 'prospect' ? 'secondary' : 'outline'
                }>
                  {company.status === 'active' && 'Activa'}
                  {company.status === 'prospect' && 'Prospecto'}
                  {company.status === 'inactive' && 'Inactiva'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 