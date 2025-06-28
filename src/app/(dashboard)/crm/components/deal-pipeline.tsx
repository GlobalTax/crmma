'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Target, 
  FileText, 
  Handshake, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'

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

const pipelineStages = [
  {
    id: 'sourcing',
    title: 'Sourcing',
    description: 'Deal identification and initial screening',
    icon: Target,
    color: 'bg-gray-100 border-gray-300',
    textColor: 'text-gray-700'
  },
  {
    id: 'nda',
    title: 'NDA',
    description: 'Non-disclosure agreement execution',
    icon: FileText,
    color: 'bg-blue-100 border-blue-300',
    textColor: 'text-blue-700'
  },
  {
    id: 'teaser',
    title: 'Teaser',
    description: 'Teaser document review and IOI',
    icon: FileText,
    color: 'bg-purple-100 border-purple-300',
    textColor: 'text-purple-700'
  },
  {
    id: 'loi',
    title: 'LOI',
    description: 'Letter of Intent negotiation',
    icon: Handshake,
    color: 'bg-yellow-100 border-yellow-300',
    textColor: 'text-yellow-700'
  },
  {
    id: 'due_diligence',
    title: 'Due Diligence',
    description: 'Comprehensive due diligence process',
    icon: AlertCircle,
    color: 'bg-orange-100 border-orange-300',
    textColor: 'text-orange-700'
  },
  {
    id: 'closing',
    title: 'Closing',
    description: 'Final negotiations and closing',
    icon: CheckCircle2,
    color: 'bg-green-100 border-green-300',
    textColor: 'text-green-700'
  }
]

interface DealPipelineProps {
  deals: Deal[]
  onDealClick: (deal: Deal) => void
  onStageChange: (dealId: string, newStage: string) => void
}

export function DealPipeline({ deals, onDealClick, onStageChange }: DealPipelineProps) {
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null)

  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId)
  }

  const getTotalValueByStage = (stageId: string) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + deal.amount, 0)
  }

  const getAverageProbabilityByStage = (stageId: string) => {
    const stageDeals = getDealsByStage(stageId)
    if (stageDeals.length === 0) return 0
    return stageDeals.reduce((sum, deal) => sum + deal.probability, 0) / stageDeals.length
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getDealTypeColor = (dealType: string) => {
    const colors = {
      'acquisition': 'bg-blue-100 text-blue-800',
      'merger': 'bg-purple-100 text-purple-800',
      'divestiture': 'bg-red-100 text-red-800',
      'joint_venture': 'bg-green-100 text-green-800',
      'private_equity': 'bg-yellow-100 text-yellow-800',
      'debt_financing': 'bg-gray-100 text-gray-800',
      'ipo': 'bg-pink-100 text-pink-800'
    }
    return colors[dealType as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getDealTypeLabel = (dealType: string) => {
    const labels = {
      'acquisition': 'Acquisition',
      'merger': 'Merger',
      'divestiture': 'Divestiture',
      'joint_venture': 'Joint Venture',
      'private_equity': 'Private Equity',
      'debt_financing': 'Debt Financing',
      'ipo': 'IPO'
    }
    return labels[dealType as keyof typeof labels] || dealType
  }

  const getPriorityColor = (daysInStage: number) => {
    if (daysInStage > 45) return 'text-red-600'
    if (daysInStage > 30) return 'text-yellow-600'
    return 'text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Pipeline</p>
                <p className="text-2xl font-bold">{formatCurrency(deals.reduce((sum, deal) => sum + deal.amount, 0))}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-2xl font-bold">{deals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                <p className="text-2xl font-bold">
                  {deals.length > 0 ? formatCurrency(deals.reduce((sum, deal) => sum + deal.amount, 0) / deals.length) : '$0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Probability</p>
                <p className="text-2xl font-bold">
                  {deals.length > 0 ? Math.round(deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {pipelineStages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id)
          const stageValue = getTotalValueByStage(stage.id)
          const avgProbability = getAverageProbabilityByStage(stage.id)
          const Icon = stage.icon

          return (
            <Card key={stage.id} className={`${stage.color} border-2`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-5 w-5 ${stage.textColor}`} />
                    <CardTitle className={`text-sm ${stage.textColor}`}>{stage.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stageDeals.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                  <p className={`text-sm font-semibold ${stage.textColor}`}>
                    {formatCurrency(stageValue)}
                  </p>
                  {avgProbability > 0 && (
                    <div className="flex items-center space-x-2">
                      <Progress value={avgProbability} className="h-1 flex-1" />
                      <span className="text-xs text-muted-foreground">{Math.round(avgProbability)}%</span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {stageDeals.map((deal) => (
                  <Card 
                    key={deal.id} 
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedDeal === deal.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setSelectedDeal(deal.id)
                      onDealClick(deal)
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm leading-tight">{deal.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getDealTypeColor(deal.dealType)}`}
                        >
                          {getDealTypeLabel(deal.dealType)}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">{deal.company}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{formatCurrency(deal.amount)}</span>
                        <span className="text-xs text-muted-foreground">{deal.probability}%</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span className={getPriorityColor(deal.daysInStage)}>
                            {deal.daysInStage}d in stage
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{deal.assignedTo}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Last: {deal.lastActivity}</span>
                      </div>

                      <Progress value={deal.probability} className="h-1" />
                    </div>
                  </Card>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No deals in this stage</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Target className="h-4 w-4 mr-2" />
              Add New Deal
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Export Pipeline
            </Button>
            <Button variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Pipeline Analytics
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Team Performance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 