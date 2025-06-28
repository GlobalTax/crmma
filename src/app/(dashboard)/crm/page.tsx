'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth/auth-provider"
import { useCompanies, useContacts, useOpportunities, useTasks } from "@/hooks/use-supabase"
import { 
  Building2, 
  Users, 
  Target, 
  CheckSquare, 
  TrendingUp,
  Plus
} from "lucide-react"
import Link from "next/link"

export default function CRMDashboard() {
  const { user } = useAuth()
  const { companies, loading: companiesLoading } = useCompanies()
  const { contacts, loading: contactsLoading } = useContacts()
  const { opportunities, loading: opportunitiesLoading } = useOpportunities()
  const { tasks, loading: tasksLoading } = useTasks()

  const loading = companiesLoading || contactsLoading || opportunitiesLoading || tasksLoading

  // Calcular estadísticas
  const totalCompanies = companies.length
  const activeCompanies = companies.filter(c => c.status === 'active').length
  const totalContacts = contacts.length
  const totalOpportunities = opportunities.length
  const openOpportunities = opportunities.filter(o => o.status === 'open').length
  const pendingTasks = tasks.filter(t => t.status === 'pending').length
  const completedTasks = tasks.filter(t => t.status === 'completed').length

  // Calcular valor total de oportunidades
  const totalOpportunityValue = opportunities
    .filter(o => o.amount && o.status === 'open')
    .reduce((sum, o) => sum + (o.amount || 0), 0)

  // Tareas de hoy
  const today = new Date()
  const tasksToday = tasks.filter(task => {
    if (!task.due_date) return false
    const dueDate = new Date(task.due_date)
    return dueDate.toDateString() === today.toDateString()
  })

  // Oportunidades con mayor probabilidad
  const highProbabilityOpportunities = opportunities
    .filter(o => o.probability >= 70 && o.status === 'open')
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Cargando dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard CRM</h1>
          <p className="text-muted-foreground">
            Bienvenido de vuelta, {user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/crm/companies/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Empresa
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/crm/contacts/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Contacto
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              {activeCompanies} activas
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
              Total de contactos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openOpportunities}</div>
            <p className="text-xs text-muted-foreground">
              {totalOpportunities} totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tareas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} completadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Card */}
      <Card>
        <CardHeader>
          <CardTitle>Valor Total de Oportunidades</CardTitle>
          <CardDescription>
            Suma de todas las oportunidades abiertas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${totalOpportunityValue.toLocaleString()}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <TrendingUp className="mr-1 h-4 w-4" />
            Oportunidades activas
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Tareas de Hoy */}
        <Card>
          <CardHeader>
            <CardTitle>Tareas de Hoy</CardTitle>
            <CardDescription>
              Tareas programadas para hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasksToday.length === 0 ? (
              <p className="text-muted-foreground">No hay tareas programadas para hoy</p>
            ) : (
              <div className="space-y-3">
                {tasksToday.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Oportunidades de Alta Probabilidad */}
        <Card>
          <CardHeader>
            <CardTitle>Oportunidades de Alta Probabilidad</CardTitle>
            <CardDescription>
              Oportunidades con 70%+ de probabilidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            {highProbabilityOpportunities.length === 0 ? (
              <p className="text-muted-foreground">No hay oportunidades de alta probabilidad</p>
            ) : (
              <div className="space-y-3">
                {highProbabilityOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{opportunity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {opportunity.companies?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${opportunity.amount?.toLocaleString()}</p>
                      <Badge variant="outline">{opportunity.probability}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acceso rápido a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/crm/companies">
                <Building2 className="h-6 w-6 mb-2" />
                Empresas
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/crm/contacts">
                <Users className="h-6 w-6 mb-2" />
                Contactos
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/crm/opportunities">
                <Target className="h-6 w-6 mb-2" />
                Oportunidades
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/crm/tasks">
                <CheckSquare className="h-6 w-6 mb-2" />
                Tareas
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 