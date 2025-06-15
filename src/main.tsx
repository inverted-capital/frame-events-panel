import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ArtifactFrame, ArtifactSyncer } from '@artifact/client/react'
import { HOST_SCOPE } from '@artifact/client/api'
import App from './App.tsx'
import type { EventsData } from './types/events'
import type { TriggersData } from './types/triggers'
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
      type: 'cron_executed',
      title: 'Daily backup completed',
      description: 'Automated daily backup of user data and system configurations completed successfully.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      metadata: {
        cronExpression: '0 2 * * *',
        executionTime: '0.34s',
        triggerName: 'Daily Backup Trigger'
      }
    },
    {
      id: '7',
      type: 'contact_request',
      title: 'New contact request from Jennifer Martinez',
      description: 'Jennifer Martinez would like to connect with you. She is a UX Designer at TechFlow Inc.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      metadata: {
        contact: 'Jennifer Martinez'
      }
    },
    {
      id: '8',
      type: 'email_received',
      title: 'New email from project-updates@company.com',
      description: 'Weekly project status update with progress reports from all active development teams.',
      timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      metadata: {
        sender: 'project-updates@company.com',
        subject: 'Weekly Project Status Update - Week 12'
      }
    }
  ]
}

const mockTriggersData: TriggersData = {
  triggers: [
    {
      id: 'trigger_1',
      name: 'High Priority Message Alert',
      description: 'Send notification when Sarah Chen sends a message',
      enabled: true,
      condition: {
        type: 'event',
        eventType: 'message_received',
        contactEquals: 'Sarah Chen'
      },
      actions: [
        {
          id: 'action_1',
          type: 'notification',
          name: 'Desktop Notification',
          description: 'Show desktop notification',
          config: {
            message: 'Priority message from {{event.metadata.contact}}: {{event.title}}'
          }
        }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      lastTriggered: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      triggerCount: 12
    },
    {
      id: 'trigger_2',
      name: 'Daily System Backup',
      description: 'Automated daily backup at 2 AM',
      enabled: true,
      condition: {
        type: 'timer',
        cronExpression: '0 2 * * *',
        description: 'Daily at 2:00 AM'
      },
      actions: [
        {
          id: 'action_2',
          type: 'custom',
          name: 'Backup Script',
          description: 'Run backup procedures',
          config: {
            script: 'console.log("Running backup..."); // backup logic here'
          }
        }
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      triggerCount: 30
    }
  ]
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArtifactFrame
      mockRepos={{ 
        mock: { 
          main: { 
            'events.json': mockEventsData,
            'triggers.json': mockTriggersData
          } 
        } 
      }}
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