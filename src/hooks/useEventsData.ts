import { useExists, useJson } from '@artifact/client/hooks'
import { eventsDataSchema, type EventsData } from '../types/events.ts'
import { useEffect, useState, useRef } from 'react'
import isEqual from 'fast-deep-equal'

const useEventsData = () => {
  const exists = useExists('events.json')
  const raw = useJson('events.json')
  const [data, setData] = useState<EventsData>()
  const dataRef = useRef<EventsData | undefined>(undefined)

  useEffect(() => {
    if (raw !== undefined) {
      const parsedData = eventsDataSchema.parse(raw)
      // Only update state if the parsed data is actually different
      if (!isEqual(dataRef.current, parsedData)) {
        setData(parsedData)
        dataRef.current = parsedData
      }
    }
  }, [raw]) // Removed 'data' from dependency array

  const loading = exists === null || (exists && raw === undefined)
  const error = exists === false ? 'events.json not found' : null

  return { data, loading, error }
}

export default useEventsData
