import { useEffect, useState } from 'react'
import { Activity, Search } from 'lucide-react'
import useEventsData from './hooks/useEventsData'
import useEventsSaver from './hooks/useEventsSaver'
import EventCard from './components/EventCard'
import EventFilter from './components/EventFilter'
import type { EventsData, EventType, Event } from './types/events'

const defaultEventsData: EventsData = {
  events: [
    {
      id: '1',
      type: 'message_received',
      title: 'New message from Sarah Chen',
      description: 'Hey! Just wanted to follow up on the project timeline we discussed. Can we sync up tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      metadata: {
        contact: 'Sarah Chen',
        threadId: 'thread_abc123'
      }
    },
    {
      id: '2',
      type: 'thread_started',
      title: 'New conversation with Alex Rodriguez',
      description: 'Alex Rodriguez started a new conversation about the upcoming product launch.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      metadata: {
        contact: 'Alex Rodriguez',
        threadId: 'thread_def456'
      }
    },
    {
      id: '3',
      type: 'file_altered',
      title: 'Document updated',
      description: 'The file "project-proposal.docx" has been modified with new content and formatting changes.',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      metadata: {
        fileName: 'project-proposal.docx',
        filePath: '/documents/proposals/'
      }
    },
    {
      id: '4',
      type: 'app_installed',
      title: 'New application installed',
      description: 'Successfully installed Design Studio Pro with enhanced collaboration features.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      metadata: {
        appName: 'Design Studio Pro',
        appVersion: 'v2.4.1'
      }
    },
    {
      id: '5',
      type: 'file_deleted',
      title: 'File removed',
      description: 'The temporary file "temp_backup.zip" has been permanently deleted from the system.',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      metadata: {
        fileName: 'temp_backup.zip',
        filePath: '/temp/'
      }
    },
    {
      id: '6',
      type: 'message_received',
      title: 'New message from Marcus Kim',
      description: 'Thanks for the feedback on the designs. I\'ve made the requested changes and updated the files.',
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      metadata: {
        contact: 'Marcus Kim',
        threadId: 'thread_ghi789'
      }
    },
    {
      id: '7',
      type: 'thread_started',
      title: 'New conversation with Emma Johnson',
      description: 'Emma Johnson initiated a discussion about the Q4 marketing strategy and budget allocation.',
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      metadata: {
        contact: 'Emma Johnson',
        threadId: 'thread_jkl012'
      }
    },
    {
      id: '8',
      type: 'file_altered',
      title: 'Spreadsheet updated',
      description: 'The budget analysis spreadsheet has been updated with new quarterly projections and formulas.',
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      metadata: {
        fileName: 'budget-analysis-q4.xlsx',
        filePath: '/finance/reports/'
      }
    },
    {
      id: '9',
      type: 'message_received',
      title: 'New message from David Park',
      description: 'Can we schedule a code review for the authentication module? I have some concerns about the security implementation.',
      timestamp: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
      metadata: {
        contact: 'David Park',
        threadId: 'thread_mno345'
      }
    },
    {
      id: '10',
      type: 'app_installed',
      title: 'Security scanner installed',
      description: 'CodeScan Security Pro has been installed to monitor code vulnerabilities and compliance.',
      timestamp: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
      metadata: {
        appName: 'CodeScan Security Pro',
        appVersion: 'v3.1.0'
      }
    },
    {
      id: '11',
      type: 'file_deleted',
      title: 'Old logs removed',
      description: 'Outdated log files from previous deployments have been cleaned up to free disk space.',
      timestamp: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
      metadata: {
        fileName: 'deployment-logs-2024-01.tar.gz',
        filePath: '/logs/archive/'
      }
    },
    {
      id: '12',
      type: 'thread_started',
      title: 'New conversation with Lisa Thompson',
      description: 'Lisa Thompson started a discussion about the new user interface designs and accessibility requirements.',
      timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
      metadata: {
        contact: 'Lisa Thompson',
        threadId: 'thread_pqr678'
      }
    },
    {
      id: '13',
      type: 'message_received',
      title: 'New message from James Wilson',
      description: 'The database migration completed successfully. All tables have been updated with the new schema.',
      timestamp: new Date(Date.now() - 1000 * 60 * 660).toISOString(),
      metadata: {
        contact: 'James Wilson',
        threadId: 'thread_stu901'
      }
    },
    {
      id: '14',
      type: 'file_altered',
      title: 'Configuration updated',
      description: 'Application configuration file has been modified to include new API endpoints and feature flags.',
      timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
      metadata: {
        fileName: 'app-config.json',
        filePath: '/config/'
      }
    },
    {
      id: '15',
      type: 'app_installed',
      title: 'Analytics platform installed',
      description: 'DataViz Analytics Suite has been installed to provide comprehensive business intelligence dashboards.',
      timestamp: new Date(Date.now() - 1000 * 60 * 780).toISOString(),
      metadata: {
        appName: 'DataViz Analytics Suite',
        appVersion: 'v4.2.3'
      }
    },
    {
      id: '16',
      type: 'message_received',
      title: 'New message from Rachel Green',
      description: 'The client meeting went well! They approved the mockups and want to move forward with development.',
      timestamp: new Date(Date.now() - 1000 * 60 * 840).toISOString(),
      metadata: {
        contact: 'Rachel Green',
        threadId: 'thread_vwx234'
      }
    },
    {
      id: '17',
      type: 'file_deleted',
      title: 'Duplicate files removed',
      description: 'Removed duplicate image assets that were consuming unnecessary storage space.',
      timestamp: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
      metadata: {
        fileName: 'hero-banner-copy.png',
        filePath: '/assets/images/'
      }
    },
    {
      id: '18',
      type: 'thread_started',
      title: 'New conversation with Michael Brown',
      description: 'Michael Brown initiated a discussion about implementing automated testing for the mobile application.',
      timestamp: new Date(Date.now() - 1000 * 60 * 960).toISOString(),
      metadata: {
        contact: 'Michael Brown',
        threadId: 'thread_yzab56'
      }
    },
    {
      id: '19',
      type: 'file_altered',
      title: 'API documentation updated',
      description: 'REST API documentation has been updated with new endpoints and improved examples.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1020).toISOString(),
      metadata: {
        fileName: 'api-docs.md',
        filePath: '/documentation/'
      }
    },
    {
      id: '20',
      type: 'message_received',
      title: 'New message from Anna Davis',
      description: 'I\'ve finished the user research analysis. The findings are quite interesting and will impact our roadmap.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1080).toISOString(),
      metadata: {
        contact: 'Anna Davis',
        threadId: 'thread_cdef78'
      }
    },
    {
      id: '21',
      type: 'app_installed',
      title: 'Project management tool installed',
      description: 'TaskFlow Pro has been installed to streamline project management and team collaboration.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1140).toISOString(),
      metadata: {
        appName: 'TaskFlow Pro',
        appVersion: 'v5.1.2'
      }
    },
    {
      id: '22',
      type: 'file_deleted',
      title: 'Test data cleaned up',
      description: 'Removed test database files and mock data that are no longer needed for development.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
      metadata: {
        fileName: 'test-data.sql',
        filePath: '/database/test/'
      }
    },
    {
      id: '23',
      type: 'message_received',
      title: 'New message from Tom Martinez',
      description: 'The performance optimization is complete. Page load times have improved by 40% across all devices.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1260).toISOString(),
      metadata: {
        contact: 'Tom Martinez',
        threadId: 'thread_ghij90'
      }
    },
    {
      id: '24',
      type: 'thread_started',
      title: 'New conversation with Sophie Clark',
      description: 'Sophie Clark started a discussion about the upcoming product demo and presentation materials.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1320).toISOString(),
      metadata: {
        contact: 'Sophie Clark',
        threadId: 'thread_klmn12'
      }
    },
    {
      id: '25',
      type: 'file_altered',
      title: 'User guide updated',
      description: 'The user manual has been revised with new screenshots and step-by-step tutorials.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1380).toISOString(),
      metadata: {
        fileName: 'user-guide.pdf',
        filePath: '/documentation/guides/'
      }
    }
  ]
}

export default function App() {
  const { data, loading, error } = useEventsData()
  const save = useEventsSaver()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])

  useEffect(() => {
    if (error === 'events.json not found') {
      save(defaultEventsData)
    }
  }, [error, save])

  useEffect(() => {
    if (data?.events) {
      let filtered = data.events

      // Filter by selected types
      if (selectedTypes.length > 0) {
        filtered = filtered.filter(event => selectedTypes.includes(event.type as EventType))
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.metadata?.contact?.toLowerCase().includes(query) ||
          event.metadata?.fileName?.toLowerCase().includes(query) ||
          event.metadata?.appName?.toLowerCase().includes(query)
        )
      }

      // Sort by timestamp (most recent first)
      filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setFilteredEvents(filtered)
    }
  }, [data, selectedTypes, searchQuery])

  const handleTypeToggle = (type: EventType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleClearAll = () => {
    setSelectedTypes([])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg">Loading events...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity Dashboard</h1>
              <p className="text-gray-600">Track and manage all your important events</p>
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
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600">
                  {searchQuery || selectedTypes.length > 0 
                    ? 'Try adjusting your filters or search query'
                    : 'No events have been recorded yet'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}