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
  AlertCircle
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
  const totalContacts = contacts.length
  const totalOpportunities = opportunities.length
  const completedTasks = tasks.filter(task => task.status === 'completed').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard CRM</h1>
        <Button>Nueva Oportunidad</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              Total de empresas registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contactos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">
              Contactos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              Oportunidades abiertas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              De {tasks.length} tareas totales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {opportunities.slice(0, 5).map((opportunity) => (
              <div key={opportunity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{opportunity.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${opportunity.value?.toLocaleString()} • {opportunity.stage}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    opportunity.stage === 'closed_won' ? 'default' :
                    opportunity.stage === 'closed_lost' ? 'destructive' :
                    opportunity.stage === 'proposal' ? 'secondary' : 'outline'
                  }>
                    {opportunity.stage === 'lead' && <Clock className="h-3 w-3 mr-1" />}
                    {opportunity.stage === 'qualified' && <AlertCircle className="h-3 w-3 mr-1" />}
                    {opportunity.stage === 'proposal' && <Target className="h-3 w-3 mr-1" />}
                    {opportunity.stage === 'closed_won' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {opportunity.stage}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Companies */}
      <Card>
        <CardHeader>
          <CardTitle>Empresas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {companies.slice(0, 5).map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {company.industry} • {company.size} empleados
                  </p>
                </div>
                <Badge variant="outline">{company.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 