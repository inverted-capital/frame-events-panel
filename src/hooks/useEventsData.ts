import { useExists, useJson } from '@artifact/client/hooks'
import { eventsDataSchema, type EventsData } from '../types/events.ts'
import { useEffect, useState } from 'react'
import isEqual from 'fast-deep-equal'

const useEventsData = () => {
  const exists = useExists('events.json')
  const raw = useJson('events.json')
  const [data, setData] = useState<EventsData>()

  useEffect(() => {
    if (raw !== undefined) {
      const parsedData = eventsDataSchema.parse(raw)
      // Only update state if the parsed data is actually different
      if (!isEqual(data, parsedData)) {
        setData(parsedData)
      }
    }
  }, [raw, data])

  const loading = exists === null || (exists && raw === undefined)
  const error = exists === false ? 'events.json not found' : null

  return { data, loading, error }
}

export default useEventsData