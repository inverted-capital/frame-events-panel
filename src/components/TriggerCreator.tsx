import { useState, useEffect } from 'react'
import {
  Plus,
  X,
  Filter,
  Clock,
  Bell,
  Webhook,
  Mail,
  FileText,
  Settings,
  Save,
  AlertCircle
} from 'lucide-react'
import useTriggersData from '../hooks/useTriggersData'
import useTriggersSaver from '../hooks/useTriggersSaver'
import type {
  Trigger,
  Action,
  TriggerCondition,
  EventTrigger,
  TimerTrigger,
  ActionType
} from '../types/triggers'
import type { EventType } from '../types/events'

interface TriggerCreatorProps {
  onClose: () => void
  onSaved: () => void
  editingTrigger?: Trigger | null
}

const TriggerCreator = ({
  onClose,
  onSaved,
  editingTrigger
}: TriggerCreatorProps) => {
  const { data } = useTriggersData()
  const save = useTriggersSaver()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [enabled, setEnabled] = useState(true)
  const [triggerType, setTriggerType] = useState<'event' | 'timer'>('event')

  // Event trigger fields
  const [eventType, setEventType] = useState<EventType | ''>('')
  const [titleContains, setTitleContains] = useState('')
  const [descriptionContains, setDescriptionContains] = useState('')
  const [contactEquals, setContactEquals] = useState('')

  // Timer trigger fields
  const [cronExpression, setCronExpression] = useState('0 0 * * *')
  const [cronDescription, setCronDescription] = useState('Daily at midnight')

  // Actions
  const [actions, setActions] = useState<Action[]>([])
  const [showActionForm, setShowActionForm] = useState(false)

  // Action form fields
  const [actionType, setActionType] = useState<ActionType>('notification')
  const [actionName, setActionName] = useState('')
  const [actionDescription, setActionDescription] = useState('')
  const [actionConfig, setActionConfig] = useState<Record<string, string>>({})

  useEffect(() => {
    if (editingTrigger) {
      setName(editingTrigger.name)
      setDescription(editingTrigger.description)
      setEnabled(editingTrigger.enabled)
      setTriggerType(editingTrigger.condition.type)
      setActions(editingTrigger.actions)

      if (editingTrigger.condition.type === 'event') {
        const condition = editingTrigger.condition as EventTrigger
        setEventType(condition.eventType || '')
        setTitleContains(condition.titleContains || '')
        setDescriptionContains(condition.descriptionContains || '')
        setContactEquals(condition.contactEquals || '')
      } else {
        const condition = editingTrigger.condition as TimerTrigger
        setCronExpression(condition.cronExpression)
        setCronDescription(condition.description)
      }
    }
  }, [editingTrigger])

  const eventTypes: { value: EventType; label: string }[] = [
    { value: 'message_received', label: 'Message Received' },
    { value: 'thread_started', label: 'Thread Started' },
    { value: 'file_altered', label: 'File Modified' },
    { value: 'file_deleted', label: 'File Deleted' },
    { value: 'app_installed', label: 'App Installed' },
    { value: 'contact_request', label: 'Contact Request' },
    { value: 'email_received', label: 'Email Received' }
  ]

  const cronPresets = [
    { expression: '0 0 * * *', description: 'Daily at midnight' },
    { expression: '0 9 * * *', description: 'Daily at 9:00 AM' },
    { expression: '0 0 * * 1', description: 'Weekly on Monday at midnight' },
    { expression: '0 0 1 * *', description: 'Monthly on the 1st at midnight' },
    { expression: '*/5 * * * *', description: 'Every 5 minutes' },
    { expression: '0 */6 * * *', description: 'Every 6 hours' }
  ]

  const actionTypes = [
    {
      value: 'notification' as const,
      label: 'Notification',
      icon: Bell,
      color: 'text-blue-500'
    },
    {
      value: 'webhook' as const,
      label: 'Webhook',
      icon: Webhook,
      color: 'text-green-500'
    },
    {
      value: 'email' as const,
      label: 'Email',
      icon: Mail,
      color: 'text-purple-500'
    },
    {
      value: 'log' as const,
      label: 'Log Entry',
      icon: FileText,
      color: 'text-gray-500'
    },
    {
      value: 'custom' as const,
      label: 'Custom Script',
      icon: Settings,
      color: 'text-orange-500'
    }
  ]

  const addAction = () => {
    if (!actionName.trim()) return

    const newAction: Action = {
      id: `action_${Date.now()}`,
      type: actionType,
      name: actionName,
      description: actionDescription,
      config: actionConfig
    }

    setActions([...actions, newAction])
    setActionName('')
    setActionDescription('')
    setActionConfig({})
    setShowActionForm(false)
  }

  const removeAction = (actionId: string) => {
    setActions(actions.filter((action) => action.id !== actionId))
  }

  const handleSave = async () => {
    if (!name.trim() || actions.length === 0) return

    let condition: TriggerCondition

    if (triggerType === 'event') {
      condition = {
        type: 'event',
        ...(eventType && { eventType: eventType as EventType }),
        ...(titleContains && { titleContains }),
        ...(descriptionContains && { descriptionContains }),
        ...(contactEquals && { contactEquals })
      }
    } else {
      condition = {
        type: 'timer',
        cronExpression,
        description: cronDescription
      }
    }

    const trigger: Trigger = {
      id: editingTrigger?.id || `trigger_${Date.now()}`,
      name,
      description,
      enabled,
      condition,
      actions,
      createdAt: editingTrigger?.createdAt || new Date().toISOString(),
      lastTriggered: editingTrigger?.lastTriggered,
      triggerCount: editingTrigger?.triggerCount || 0
    }

    const currentTriggers = data?.triggers || []
    const updatedTriggers = editingTrigger
      ? currentTriggers.map((t) => (t.id === editingTrigger.id ? trigger : t))
      : [...currentTriggers, trigger]

    await save({ triggers: updatedTriggers })
    onSaved()
  }

  const getActionIcon = (actionType: string) => {
    const actionDef = actionTypes.find((t) => t.value === actionType)
    if (!actionDef) return <Settings className="w-4 h-4 text-gray-500" />
    const Icon = actionDef.icon
    return <Icon className={`w-4 h-4 ${actionDef.color}`} />
  }

  const renderActionConfig = () => {
    switch (actionType) {
      case 'webhook':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <input
                type="url"
                value={actionConfig.url || ''}
                onChange={(e) =>
                  setActionConfig({ ...actionConfig, url: e.target.value })
                }
                placeholder="https://example.com/webhook"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTTP Method
              </label>
              <select
                value={actionConfig.method || 'POST'}
                onChange={(e) =>
                  setActionConfig({ ...actionConfig, method: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
          </div>
        )
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email
              </label>
              <input
                type="email"
                value={actionConfig.to || ''}
                onChange={(e) =>
                  setActionConfig({ ...actionConfig, to: e.target.value })
                }
                placeholder="user@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Template
              </label>
              <input
                type="text"
                value={actionConfig.subject || ''}
                onChange={(e) =>
                  setActionConfig({ ...actionConfig, subject: e.target.value })
                }
                placeholder="Alert: {{event.title}}"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      case 'notification':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Template
            </label>
            <textarea
              value={actionConfig.message || ''}
              onChange={(e) =>
                setActionConfig({ ...actionConfig, message: e.target.value })
              }
              placeholder="New event: {{event.title}}"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )
      case 'custom':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Script Code
            </label>
            <textarea
              value={actionConfig.script || ''}
              onChange={(e) =>
                setActionConfig({ ...actionConfig, script: e.target.value })
              }
              placeholder="console.log('Event triggered:', event);"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingTrigger ? 'Edit Trigger' : 'Create New Trigger'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter trigger name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="enabled"
                  className="text-sm font-medium text-gray-700"
                >
                  Enable trigger immediately
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this trigger does"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Trigger Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Trigger Condition
            </h3>
            <div className="flex space-x-4">
              <button
                onClick={() => setTriggerType('event')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                  triggerType === 'event'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Filter className="w-5 h-5" />
                <span>Event-based</span>
              </button>
              <button
                onClick={() => setTriggerType('timer')}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                  triggerType === 'timer'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>Timer-based</span>
              </button>
            </div>

            {triggerType === 'event' ? (
              <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700">
                  This trigger will fire when an event matches the specified
                  conditions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type (optional)
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) =>
                        setEventType(e.target.value as EventType | '')
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any event type</option>
                      {eventTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name (optional)
                    </label>
                    <input
                      type="text"
                      value={contactEquals}
                      onChange={(e) => setContactEquals(e.target.value)}
                      placeholder="Exact contact name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Contains (optional)
                    </label>
                    <input
                      type="text"
                      value={titleContains}
                      onChange={(e) => setTitleContains(e.target.value)}
                      placeholder="Text in title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description Contains (optional)
                    </label>
                    <input
                      type="text"
                      value={descriptionContains}
                      onChange={(e) => setDescriptionContains(e.target.value)}
                      placeholder="Text in description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-green-700">
                  This trigger will fire on a schedule based on the cron
                  expression.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cron Expression
                    </label>
                    <input
                      type="text"
                      value={cronExpression}
                      onChange={(e) => setCronExpression(e.target.value)}
                      placeholder="0 0 * * *"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={cronDescription}
                      onChange={(e) => setCronDescription(e.target.value)}
                      placeholder="When this runs"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Quick Presets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cronPresets.map((preset) => (
                      <button
                        key={preset.expression}
                        onClick={() => {
                          setCronExpression(preset.expression)
                          setCronDescription(preset.description)
                        }}
                        className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        {preset.description}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
              <button
                onClick={() => setShowActionForm(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Action</span>
              </button>
            </div>

            {actions.length > 0 ? (
              <div className="space-y-3">
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      {getActionIcon(action.type)}
                      <span className="font-medium">{action.name}</span>
                      {action.description && (
                        <span className="text-gray-500 text-sm">
                          - {action.description}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeAction(action.id)}
                      className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No actions configured</p>
                <p className="text-gray-500 text-sm">
                  Add at least one action to continue
                </p>
              </div>
            )}

            {/* Action Form */}
            {showActionForm && (
              <div className="p-4 border border-gray-300 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Add New Action</h4>
                  <button
                    onClick={() => setShowActionForm(false)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Type
                    </label>
                    <select
                      value={actionType}
                      onChange={(e) =>
                        setActionType(e.target.value as ActionType)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {actionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action Name
                    </label>
                    <input
                      type="text"
                      value={actionName}
                      onChange={(e) => setActionName(e.target.value)}
                      placeholder="Name this action"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={actionDescription}
                    onChange={(e) => setActionDescription(e.target.value)}
                    placeholder="Describe what this action does"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {renderActionConfig()}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowActionForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addAction}
                    disabled={!actionName.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Action
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || actions.length === 0}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{editingTrigger ? 'Update' : 'Create'} Trigger</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TriggerCreator
