import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ArtifactFrame, ArtifactSyncer } from '@artifact/client/react'
import { HOST_SCOPE } from '@artifact/client/api'
import App from './App.tsx'
import type { EventsData } from './types/events'
import './index.css'

const mockEventsData: EventsData = {
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
    }
  ]
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArtifactFrame
      mockRepos={{ mock: { main: { 'events.json': mockEventsData } } }}
      mockFrameProps={{
        target: { did: HOST_SCOPE.did, repo: 'mock', branch: 'main' }
      }}
    >
      <ArtifactSyncer>
        <App />
      </ArtifactSyncer>
    </ArtifactFrame>
  </StrictMode>
)