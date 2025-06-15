import { useState } from 'react'
import { 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Zap,
  Clock,
  Filter,
  Webhook,
  Mail,
  Bell,
  FileText,
  Settings
} from 'lucide-react'
import useTriggersData from '../hooks/useTriggersData'
import useTriggersSaver from '../hooks/useTriggersSaver'
import TriggerCreator from './TriggerCreator'
import type { Trigger, TriggersData } from '../types/triggers'

interface TriggerManagerProps {
  onClose: () => void
}

const TriggerManager = ({ onClose }: TriggerManagerProps) => {
  const { data, loading } = useTriggersData()
  const save = useTriggersSaver()
  const [showCreator, setShowCreator] = useState(false)
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null)

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'notification':
        return <Bell className="w-4 h-4 text-blue-500" />
      case 'webhook':
        return <Webhook className="w-4 h-4 text-green-500" />
      case 'email':
        return <Mail className="w-4 h-4 text-purple-500" />
      case 'log':
        return <FileText className="w-4 h-4 text-gray-500" />
      case 'custom':
        return <Settings className="w-4 h-4 text-orange-500" />
      default:
        return <Zap className="w-4 h-4 text-gray-500" />
    }
  }

  const getTriggerIcon = (trigger: Trigger) => {
    return trigger.condition.type === 'event' 
      ? <Filter className="w-5 h-5 text-blue-500" />
      : <Clock className="w-5 h-5 text-green-500" />
  }

  const formatTriggerCondition = (trigger: Trigger) => {
    if (trigger.condition.type === 'event') {
      const parts = []
      if (trigger.condition.eventType) {
        parts.push(`Event type: ${trigger.condition.eventType}`)
      }
      if (trigger.condition.titleContains) {
        parts.push(`Title contains: "${trigger.condition.titleContains}"`)
      }
      if (trigger.condition.descriptionContains) {
        parts.push(`Description contains: "${trigger.condition.descriptionContains}"`)
      }
      if (trigger.condition.contactEquals) {
        parts.push(`Contact equals: "${trigger.condition.contactEquals}"`)
      }
      return parts.length > 0 ? parts.join(' AND ') : 'Any event'
    } else {
      return `Cron: ${trigger.condition.cronExpression}`
    }
  }

  const formatLastTriggered = (timestamp?: string) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const toggleTrigger = async (triggerId: string) => {
    if (!data) return
    
    const updatedTriggers = data.triggers.map(trigger => 
      trigger.id === triggerId 
        ? { ...trigger, enabled: !trigger.enabled }
        : trigger
    )
    
    await save({ triggers: updatedTriggers })
  }

  const deleteTrigger = async (triggerId: string) => {
    if (!data) return
    
    const updatedTriggers = data.triggers.filter(trigger => trigger.id !== triggerId)
    await save({ triggers: updatedTriggers })
  }

  const handleTriggerSaved = () => {
    setShowCreator(false)
    setEditingTrigger(null)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="flex items-center space-x-3 text-gray-600">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Loading triggers...</span>
          </div>
        </div>
      </div>
    )
  }

  if (showCreator || editingTrigger) {
    return (
      <TriggerCreator 
        onClose={() => {
          setShowCreator(false)
          setEditingTrigger(null)
        }}
        onSaved={handleTriggerSaved}
        editingTrigger={editingTrigger}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trigger Management</h2>
              <p className="text-gray-600">Automate actions based on events and schedules</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowCreator(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Trigger</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 flex items-center justify-center">×</div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {data?.triggers && data.triggers.length > 0 ? (
            <div className="space-y-4">
              {data.triggers.map(trigger => (
                <div key={trigger.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getTriggerIcon(trigger)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {trigger.name}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            trigger.enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {trigger.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{trigger.description}</p>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Condition: </span>
                            <span className="text-gray-600">{formatTriggerCondition(trigger)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div>
                              <span className="font-medium text-gray-700">Actions: </span>
                              <div className="inline-flex items-center space-x-2">
                                {trigger.actions.map((action, index) => (
                                  <div key={action.id} className="flex items-center space-x-1">
                                    {getActionIcon(action.type)}
                                    <span className="text-gray-600">{action.name}</span>
                                    {index < trigger.actions.length - 1 && <span className="text-gray-400">→</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-gray-500">
                            <div>
                              <span className="font-medium">Triggered: </span>
                              <span>{trigger.triggerCount} times</span>
                            </div>
                            <div>
                              <span className="font-medium">Last: </span>
                              <span>{formatLastTriggered(trigger.lastTriggered)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleTrigger(trigger.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          trigger.enabled
                            ? 'text-amber-600 hover:bg-amber-100'
                            : 'text-green-600 hover:bg-green-100'
                        }`}
                        title={trigger.enabled ? 'Disable' : 'Enable'}
                      >
                        {trigger.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditingTrigger(trigger)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTrigger(trigger.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No triggers configured</h3>
              <p className="text-gray-600 mb-6">
                Create your first trigger to start automating actions based on events or schedules.
              </p>
              <button
                onClick={() => setShowCreator(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Trigger</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TriggerManager