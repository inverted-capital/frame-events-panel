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
      type: 'contact_request',
      title: 'New contact request from Jennifer Martinez',
      description: 'Jennifer Martinez would like to connect with you. She is a UX Designer at TechFlow Inc.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      metadata: {
        contact: 'Jennifer Martinez'
      }
    },
    {
      id: '17',
      type: 'email_received',
      title: 'New email from project-updates@company.com',
      description: 'Weekly project status update with progress reports from all active development teams.',
      timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
      metadata: {
        sender: 'project-updates@company.com',
        subject: 'Weekly Project Status Update - Week 12'
      }
    },
    {
      id: '18',
      type: 'contact_request',
      title: 'New contact request from Ryan Thompson',
      description: 'Ryan Thompson from Digital Solutions wants to connect. He mentioned your work on the mobile app project.',
      timestamp: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
      metadata: {
        contact: 'Ryan Thompson'
      }
    },
    {
      id: '19',
      type: 'email_received',
      title: 'New email from sarah.chen@client.com',
      description: 'Client feedback on the latest design mockups with detailed comments and requested revisions.',
      timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
      metadata: {
        sender: 'sarah.chen@client.com',
        subject: 'Re: Design Mockups - Feedback and Revisions'
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