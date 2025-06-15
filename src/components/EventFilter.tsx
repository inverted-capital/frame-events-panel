import { Filter, X } from 'lucide-react'
import type { EventType } from '../types/events'

interface EventFilterProps {
  selectedTypes: EventType[]
  onTypeToggle: (type: EventType) => void
  onClearAll: () => void
}

const EventFilter = ({ selectedTypes, onTypeToggle, onClearAll }: EventFilterProps) => {
  const eventTypes: { type: EventType; label: string; color: string }[] = [
    { type: 'message_received', label: 'Messages', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { type: 'thread_started', label: 'New Threads', color: 'bg-green-100 text-green-800 border-green-200' },
    { type: 'file_altered', label: 'File Changes', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { type: 'file_deleted', label: 'File Deletions', color: 'bg-red-100 text-red-800 border-red-200' },
    { type: 'app_installed', label: 'App Installs', color: 'bg-purple-100 text-purple-800 border-purple-200' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Events</h3>
        </div>
        {selectedTypes.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {eventTypes.map(({ type, label, color }) => {
          const isSelected = selectedTypes.includes(type)
          return (
            <button
              key={type}
              onClick={() => onTypeToggle(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                isSelected 
                  ? color + ' shadow-sm' 
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
      
      {selectedTypes.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {selectedTypes.length} of {eventTypes.length} event types
        </div>
      )}
    </div>
  )
}

export default EventFilter