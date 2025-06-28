'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Building2, 
  DollarSign, 
  FileText, 
  Target, 
  Users, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

interface DealFormData {
  // Basic Info
  dealName: string
  dealType: string
  targetCompany: string
  industry: string
  
  // Financial
  transactionSizeMin: string
  transactionSizeMax: string
  revenue: string
  ebitda: string
  
  // Timeline
  expectedClosing: string
  exclusivityPeriod: string
  
  // Stakeholders
  leadContact: string
  investmentBank: string
  
  // Strategy
  strategicRationale: string
  synergies: string
}

const steps = [
  {
    id: 1,
    title: 'Deal Overview',
    description: 'Basic deal information and type',
    icon: Target
  },
  {
    id: 2,
    title: 'Target Company',
    description: 'Company details and industry',
    icon: Building2
  },
  {
    id: 3,
    title: 'Financial Metrics',
    description: 'Valuation and financial data',
    icon: DollarSign
  },
  {
    id: 4,
    title: 'Timeline & Stakeholders',
    description: 'Key dates and contacts',
    icon: Calendar
  },
  {
    id: 5,
    title: 'Strategic Analysis',
    description: 'Rationale and synergies',
    icon: FileText
  }
]

interface DealCreationWizardProps {
  onClose: () => void
  onSubmit: (data: DealFormData) => void
}

export function DealCreationWizard({ onClose, onSubmit }: DealCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<DealFormData>({
    dealName: '',
    dealType: '',
    targetCompany: '',
    industry: '',
    transactionSizeMin: '',
    transactionSizeMax: '',
    revenue: '',
    ebitda: '',
    expectedClosing: '',
    exclusivityPeriod: '',
    leadContact: '',
    investmentBank: '',
    strategicRationale: '',
    synergies: ''
  })

  const updateFormData = (field: keyof DealFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const progress = (currentStep / steps.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="dealName">Deal Name *</Label>
              <Input
                id="dealName"
                placeholder="e.g., Acquisition of TechCorp Solutions"
                value={formData.dealName}
                onChange={(e) => updateFormData('dealName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="dealType">Deal Type *</Label>
              <Select value={formData.dealType} onValueChange={(value) => updateFormData('dealType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select deal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acquisition">Acquisition</SelectItem>
                  <SelectItem value="merger">Merger</SelectItem>
                  <SelectItem value="divestiture">Divestiture</SelectItem>
                  <SelectItem value="joint_venture">Joint Venture</SelectItem>
                  <SelectItem value="private_equity">Private Equity</SelectItem>
                  <SelectItem value="debt_financing">Debt Financing</SelectItem>
                  <SelectItem value="ipo">IPO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Badge variant="outline" className="mb-2">
                  {formData.dealType ? formData.dealType.replace('_', ' ').toUpperCase() : 'SELECT TYPE'}
                </Badge>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="targetCompany">Target Company Name *</Label>
              <Input
                id="targetCompany"
                placeholder="e.g., TechCorp Solutions Inc."
                value={formData.targetCompany}
                onChange={(e) => updateFormData('targetCompany', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="industry">Industry Sector *</Label>
              <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="financial_services">Financial Services</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="telecommunications">Telecommunications</SelectItem>
                  <SelectItem value="consumer_goods">Consumer Goods</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transactionSizeMin">Transaction Size Min (USD)</Label>
                <Input
                  id="transactionSizeMin"
                  placeholder="e.g., 10000000"
                  value={formData.transactionSizeMin}
                  onChange={(e) => updateFormData('transactionSizeMin', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="transactionSizeMax">Transaction Size Max (USD)</Label>
                <Input
                  id="transactionSizeMax"
                  placeholder="e.g., 15000000"
                  value={formData.transactionSizeMax}
                  onChange={(e) => updateFormData('transactionSizeMax', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="revenue">Annual Revenue (USD)</Label>
                <Input
                  id="revenue"
                  placeholder="e.g., 5000000"
                  value={formData.revenue}
                  onChange={(e) => updateFormData('revenue', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ebitda">EBITDA (USD)</Label>
                <Input
                  id="ebitda"
                  placeholder="e.g., 1500000"
                  value={formData.ebitda}
                  onChange={(e) => updateFormData('ebitda', e.target.value)}
                />
              </div>
            </div>

            {formData.revenue && formData.ebitda && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Calculated Multiples</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Revenue Multiple:</span>
                    <span className="ml-2 font-semibold">
                      {formData.transactionSizeMin && formData.revenue 
                        ? (Number(formData.transactionSizeMin) / Number(formData.revenue)).toFixed(1) + 'x'
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">EBITDA Multiple:</span>
                    <span className="ml-2 font-semibold">
                      {formData.transactionSizeMin && formData.ebitda 
                        ? (Number(formData.transactionSizeMin) / Number(formData.ebitda)).toFixed(1) + 'x'
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expectedClosing">Expected Closing Date</Label>
                <Input
                  id="expectedClosing"
                  type="date"
                  value={formData.expectedClosing}
                  onChange={(e) => updateFormData('expectedClosing', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="exclusivityPeriod">Exclusivity Period End</Label>
                <Input
                  id="exclusivityPeriod"
                  type="date"
                  value={formData.exclusivityPeriod}
                  onChange={(e) => updateFormData('exclusivityPeriod', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leadContact">Lead Contact</Label>
                <Input
                  id="leadContact"
                  placeholder="e.g., john.smith@company.com"
                  value={formData.leadContact}
                  onChange={(e) => updateFormData('leadContact', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="investmentBank">Investment Bank</Label>
                <Input
                  id="investmentBank"
                  placeholder="e.g., Goldman Sachs"
                  value={formData.investmentBank}
                  onChange={(e) => updateFormData('investmentBank', e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="strategicRationale">Strategic Rationale</Label>
              <Textarea
                id="strategicRationale"
                placeholder="Describe the strategic reasoning behind this deal..."
                rows={4}
                value={formData.strategicRationale}
                onChange={(e) => updateFormData('strategicRationale', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="synergies">Expected Synergies</Label>
              <Textarea
                id="synergies"
                placeholder="Detail expected cost savings, revenue synergies, operational improvements..."
                rows={4}
                value={formData.synergies}
                onChange={(e) => updateFormData('synergies', e.target.value)}
              />
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Ready to Create Deal</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                All required information has been collected. Review and submit to create your M&A deal.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create New M&A Deal</CardTitle>
              <CardDescription>
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
              </CardDescription>
            </div>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
          
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id
                
                return (
                  <div key={step.id} className="flex flex-col items-center space-y-2">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isActive ? 'bg-primary text-primary-foreground' : 
                        isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}
                    `}>
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className="text-xs text-center">{step.title}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{steps[currentStep - 1]?.title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1]?.description}</p>
          </div>

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep === steps.length ? (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Create Deal
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 