import { useEffect, useState } from 'react'
import { Activity, Search, Zap } from 'lucide-react'
import useEventsData from './hooks/useEventsData'
import useTriggersData from './hooks/useTriggersData'
import EventCard from './components/EventCard'
import EventFilter from './components/EventFilter'
import EventModal from './components/EventModal'
import TriggerManager from './components/TriggerManager'
import type { EventType, Event } from './types/events'

export default function App() {
  const { data, loading } = useEventsData()
  const { data: triggersData } = useTriggersData()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showTriggerManager, setShowTriggerManager] = useState(false)

  useEffect(() => {
    if (data?.events) {
      let filtered = data.events

      // Filter by selected types
      if (selectedTypes.length > 0) {
        filtered = filtered.filter((event) =>
          selectedTypes.includes(event.type as EventType)
        )
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (event) =>
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.metadata?.contact?.toLowerCase().includes(query) ||
            event.metadata?.fileName?.toLowerCase().includes(query) ||
            event.metadata?.appName?.toLowerCase().includes(query) ||
            event.metadata?.sender?.toLowerCase().includes(query) ||
            event.metadata?.subject?.toLowerCase().includes(query)
        )
      }

      // Sort by timestamp (most recent first)
      filtered.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )

      setFilteredEvents(filtered)
    }
  }, [data, selectedTypes, searchQuery])

  const handleTypeToggle = (type: EventType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleClearAll = () => {
    setSelectedTypes([])
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleCloseModal = () => {
    setSelectedEvent(null)
  }

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg">Loading events...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Activity Dashboard
                </h1>
                <p className="text-gray-600">
                  Track and manage all your important events
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm text-gray-500">Active Triggers</div>
                <div className="text-2xl font-bold text-blue-600">
                  {triggersData?.triggers.filter((t) => t.enabled).length || 0}
                </div>
              </div>
              <button
                onClick={() => setShowTriggerManager(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Zap className="w-5 h-5" />
                <span>Manage Triggers</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <EventFilter
                selectedTypes={selectedTypes}
                onTypeToggle={handleTypeToggle}
                onClearAll={handleClearAll}
              />
            </div>
          </div>

          {/* Main Content - Events List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Activity
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredEvents.length} events)
                </span>
              </h2>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => handleEventClick(event)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600">
                  {searchQuery || selectedTypes.length > 0
                    ? 'Try adjusting your filters or search query'
                    : 'No events have been recorded yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <EventModal event={selectedEvent} onClose={handleCloseModal} />

      {/* Trigger Manager */}
      {showTriggerManager && (
        <TriggerManager onClose={() => setShowTriggerManager(false)} />
      )}
    </div>
  )
}
