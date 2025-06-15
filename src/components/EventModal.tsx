import {
  MessageCircle,
  MessageSquarePlus,
  FileEdit,
  FileX,
  Package,
  Clock,
  User,
  File,
  UserPlus,
  Mail,
  X,
  MapPin,
  Hash,
  Calendar
} from 'lucide-react'
import type { Event } from '../types/events'

interface EventModalProps {
  event: Event | null
  onClose: () => void
}

const EventModal = ({ event, onClose }: EventModalProps) => {
  if (!event) return null

  const getEventIcon = () => {
    switch (event.type) {
      case 'message_received':
        return <MessageCircle className="w-8 h-8 text-blue-500" />
      case 'thread_started':
        return <MessageSquarePlus className="w-8 h-8 text-green-500" />
      case 'file_altered':
        return <FileEdit className="w-8 h-8 text-amber-500" />
      case 'file_deleted':
        return <FileX className="w-8 h-8 text-red-500" />
      case 'app_installed':
        return <Package className="w-8 h-8 text-purple-500" />
      case 'contact_request':
        return <UserPlus className="w-8 h-8 text-teal-500" />
      case 'email_received':
        return <Mail className="w-8 h-8 text-indigo-500" />
      default:
        return <Clock className="w-8 h-8 text-gray-500" />
    }
  }

  const getEventTypeLabel = () => {
    switch (event.type) {
      case 'message_received':
        return 'Message Received'
      case 'thread_started':
        return 'New Thread Started'
      case 'file_altered':
        return 'File Modified'
      case 'file_deleted':
        return 'File Deleted'
      case 'app_installed':
        return 'Application Installed'
      case 'contact_request':
        return 'Contact Request'
      case 'email_received':
        return 'Email Received'
      default:
        return 'Unknown Event'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(date)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">{getEventIcon()}</div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">
                {getEventTypeLabel()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {event.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Timestamp */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Timestamp
            </h3>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{formatTimestamp(event.timestamp)}</span>
            </div>
          </div>

          {/* Event ID */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Event ID
            </h3>
            <div className="flex items-center space-x-2 text-gray-600 font-mono">
              <Hash className="w-5 h-5" />
              <span>{event.id}</span>
            </div>
          </div>

          {/* Metadata */}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Details
              </h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                {event.metadata.contact && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Contact:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {event.metadata.contact}
                      </span>
                    </div>
                  </div>
                )}

                {event.metadata.sender && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Sender:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {event.metadata.sender}
                      </span>
                    </div>
                  </div>
                )}

                {event.metadata.subject && (
                  <div className="flex items-start space-x-3">
                    <Hash className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Subject:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {event.metadata.subject}
                      </span>
                    </div>
                  </div>
                )}

                {event.metadata.threadId && (
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Thread ID:
                      </span>
                      <span className="ml-2 text-gray-900 font-mono text-sm">
                        {event.metadata.threadId}
                      </span>
                    </div>
                  </div>
                )}

                {event.metadata.fileName && (
                  <div className="flex items-center space-x-3">
                    <File className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        File:
                      </span>
                      <span className="ml-2 text-gray-900 font-mono text-sm">
                        {event.metadata.fileName}
                      </span>
                    </div>
                  </div>
                )}

                {event.metadata.filePath && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Path:
                      </span>
                      <span className="ml-2 text-gray-900 font-mono text-sm">
                        {event.metadata.filePath}
                      </span>
                    </div>
                  </div>
                )}

                {event.metadata.appName && (
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Application:
                      </span>
                      <span className="ml-2 text-gray-900">
                        {event.metadata.appName}
                        {event.metadata.appVersion && (
                          <span className="text-gray-600 ml-1">
                            ({event.metadata.appVersion})
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventModal
