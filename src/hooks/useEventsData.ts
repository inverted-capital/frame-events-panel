import { useExists, useJson } from '@artifact/client/hooks'
import { eventsDataSchema, type EventsData } from '../types/events.ts'
import { useEffect, useState } from 'react'

const useEventsData = () => {
  const exists = useExists('events.json')
  const raw = useJson('events.json')
  const [data, setData] = useState<EventsData>()

  useEffect(() => {
    if (raw !== undefined) {
      setData(eventsDataSchema.parse(raw))
    }
  }, [raw])

  const loading = exists === null || (exists && raw === undefined)
  const error = exists === false ? 'events.json not found' : null

  return { data, loading, error }
}

export default useEventsData