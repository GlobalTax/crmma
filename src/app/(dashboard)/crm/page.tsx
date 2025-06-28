'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, TrendingUp, DollarSign, CheckCircle2, Plus, BarChart3, Target } from 'lucide-react'
import { useSupabase } from '@/hooks/use-supabase'
import { DealCreationWizard } from './components/deal-creation-wizard'
import { DealPipeline } from './components/deal-pipeline'

interface _Company {
  id: string
  name: string
  industry: string
  size: string
  created_at: string
}

interface _Opportunity {
  id: string
  title: string
  stage: string
  deal_type: string
  transaction_size_min: number
  transaction_size_max: number
  companies?: { name: string }
  created_at: string
}

interface Deal {
  id: string
  title: string
  company: string
  amount: number
  stage: string
  probability: number
  dealType: string
  daysInStage: number
  lastActivity: string
  assignedTo: string
}

export default function CRMPage() {
  const [showDealWizard, setShowDealWizard] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const { companies, contacts: _contacts, opportunities, tasks: _tasks, fetchCompanies, fetchContacts, fetchOpportunities, fetchTasks } = useSupabase()
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

  // Mock data para el pipeline (en producción vendría de la DB)
  const mockDeals: Deal[] = [
    {
      id: '1',
      title: 'Acquisition of TechCorp Solutions',
      company: 'TechCorp Solutions Inc.',
      amount: 12500000,
      stage: 'loi',
      probability: 75,
      dealType: 'acquisition',
      daysInStage: 15,
      lastActivity: '2 days ago',
      assignedTo: 'John Smith'
    },
    {
      id: '2',
      title: 'Global Manufacturing Merger',
      company: 'Global Manufacturing Inc.',
      amount: 25000000,
      stage: 'due_diligence',
      probability: 85,
      dealType: 'merger',
      daysInStage: 32,
      lastActivity: '1 day ago',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: '3',
      title: 'FinTech PE Investment',
      company: 'FinTech Innovations',
      amount: 8000000,
      stage: 'sourcing',
      probability: 25,
      dealType: 'private_equity',
      daysInStage: 8,
      lastActivity: '5 hours ago',
      assignedTo: 'Mike Davis'
    },
    {
      id: '4',
      title: 'Healthcare Acquisition',
      company: 'MedTech Solutions',
      amount: 18000000,
      stage: 'nda',
      probability: 45,
      dealType: 'acquisition',
      daysInStage: 22,
      lastActivity: '3 days ago',
      assignedTo: 'Emily Chen'
    },
    {
      id: '5',
      title: 'Energy Divestiture',
      company: 'Green Energy Corp',
      amount: 15000000,
      stage: 'teaser',
      probability: 60,
      dealType: 'divestiture',
      daysInStage: 18,
      lastActivity: '1 day ago',
      assignedTo: 'Robert Wilson'
    }
  ]

  if (loading) {
    return <div className="p-6">Cargando...</div>
  }

  const totalCompanies = companies.length
  const totalDeals = opportunities.length
  const totalDealValue = opportunities.reduce((sum, deal) => sum + (deal.amount || 0), 0)
  const activeDeals = opportunities.filter(deal => deal.status === 'open').length
  const closedDeals = opportunities.filter(deal => deal.stage === 'closed_won').length

  const stats = [
    {
      title: 'Empresas Target',
      value: totalCompanies,
      icon: Building2,
      description: 'Empresas en pipeline'
    },
    {
      title: 'Deals Activos',
      value: activeDeals,
      icon: TrendingUp,
      description: `De ${totalDeals} deals totales`
    },
    {
      title: 'Valor Total Pipeline',
      value: totalDealValue,
      icon: DollarSign,
      description: 'USD en pipeline',
      format: 'currency'
    },
    {
      title: 'Deals Cerrados',
      value: closedDeals,
      icon: CheckCircle2,
      description: 'Transacciones exitosas'
    }
  ]

  const getStageInfo = (stage: string) => {
    const stageMap = {
      'sourcing': { label: 'Sourcing', color: 'bg-gray-100 text-gray-800' },
      'nda': { label: 'NDA', color: 'bg-blue-100 text-blue-800' },
      'teaser': { label: 'Teaser', color: 'bg-purple-100 text-purple-800' },
      'ioi': { label: 'IOI', color: 'bg-indigo-100 text-indigo-800' },
      'loi': { label: 'LOI', color: 'bg-yellow-100 text-yellow-800' },
      'due_diligence': { label: 'Due Diligence', color: 'bg-orange-100 text-orange-800' },
      'closing': { label: 'Closing', color: 'bg-green-100 text-green-800' },
      'closed_won': { label: 'Closed Won', color: 'bg-green-500 text-white' },
      'closed_lost': { label: 'Closed Lost', color: 'bg-red-100 text-red-800' }
    }
    return stageMap[stage as keyof typeof stageMap] || { label: stage, color: 'bg-gray-100 text-gray-800' }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleDealWizardSubmit = (_data: unknown) => {
    // TODO: Implementar lógica para guardar el deal en la DB
    // console.log('New deal data:', _data)
    setShowDealWizard(false)
  }

  const handleDealClick = (deal: Deal) => {
    // TODO: Implementar navegación al detalle del deal
    // console.log('Deal clicked:', deal)
    return deal
  }

  const handleStageChange = (dealId: string, newStage: string) => {
    // TODO: Implementar lógica para cambiar el stage del deal
    // console.log('Stage change:', dealId, newStage)
    return { dealId, newStage }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard M&A</h1>
          <p className="text-muted-foreground">
            Gestión integral de operaciones de fusiones y adquisiciones
          </p>
        </div>
        <Button onClick={() => setShowDealWizard(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Deal M&A
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.format === 'currency' ? formatCurrency(stat.value) : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Deal Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Deals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deals M&A Recientes</CardTitle>
                <CardDescription>Últimas oportunidades de M&A</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.slice(0, 5).map((opportunity) => {
                    const stageInfo = getStageInfo(opportunity.stage)
                    return (
                      <div key={opportunity.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{opportunity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {opportunity.deal_type?.replace('_', ' ').toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge className={stageInfo.color}>
                            {stageInfo.label}
                          </Badge>
                          <p className="text-sm font-medium">
                            {formatCurrency(opportunity.amount || 0)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  {(!opportunities || opportunities.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">
                      No hay deals disponibles
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Empresas Target Recientes</CardTitle>
                <CardDescription>Últimas empresas añadidas al pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companies.slice(0, 5).map((company) => (
                    <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">{company.name}</p>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{company.size}</Badge>
                      </div>
                    </div>
                  ))}
                  {(!companies || companies.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">
                      No hay empresas disponibles
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline">
          <DealPipeline 
            deals={mockDeals}
            onDealClick={handleDealClick}
            onStageChange={handleStageChange}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics M&A</CardTitle>
              <CardDescription>Métricas avanzadas y análisis de performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard en desarrollo</p>
                <p className="text-sm">Próximamente métricas avanzadas de M&A</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deal Creation Wizard Modal */}
      {showDealWizard && (
        <DealCreationWizard
          onClose={() => setShowDealWizard(false)}
          onSubmit={handleDealWizardSubmit}
        />
      )}
    </div>
  )
} 