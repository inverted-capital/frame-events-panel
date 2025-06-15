import { 
  MessageCircle, 
  MessageSquarePlus, 
  FileEdit, 
  FileX, 
  Package,
  Clock,
  User,
  File
} from 'lucide-react'
import type { Event } from '../types/events'

interface EventCardProps {
  event: Event
}

const EventCard = ({ event }: EventCardProps) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'message_received':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'thread_started':
        return <MessageSquarePlus className="w-5 h-5 text-green-500" />
      case 'file_altered':
        return <FileEdit className="w-5 h-5 text-amber-500" />
      case 'file_deleted':
        return <FileX className="w-5 h-5 text-red-500" />
      case 'app_installed':
        return <Package className="w-5 h-5 text-purple-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getEventColor = () => {
    switch (event.type) {
      case 'message_received':
        return 'border-l-blue-500 bg-blue-50'
      case 'thread_started':
        return 'border-l-green-500 bg-green-50'
      case 'file_altered':
        return 'border-l-amber-500 bg-amber-50'
      case 'file_deleted':
        return 'border-l-red-500 bg-red-50'
      case 'app_installed':
        return 'border-l-purple-500 bg-purple-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className={`border-l-4 ${getEventColor()} rounded-r-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getEventIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {event.title}
            </h3>
            <p className="text-gray-600 mb-3 leading-relaxed">
              {event.description}
            </p>
            
            {event.metadata && (
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                {event.metadata.contact && (
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{event.metadata.contact}</span>
                  </div>
                )}
                {event.metadata.fileName && (
                  <div className="flex items-center space-x-1">
                    <File className="w-4 h-4" />
                    <span>{event.metadata.fileName}</span>
                  </div>
                )}
                {event.metadata.appName && (
                  <div className="flex items-center space-x-1">
                    <Package className="w-4 h-4" />
                    <span>{event.metadata.appName} {event.metadata.appVersion}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-400 ml-4">
          <Clock className="w-4 h-4" />
          <span>{formatTime(event.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}

export default EventCard