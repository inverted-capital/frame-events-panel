import { useExists, useJson } from '@artifact/client/hooks'
import { triggersDataSchema, type TriggersData } from '../types/triggers'
import { useEffect, useState, useRef } from 'react'
import isEqual from 'fast-deep-equal'

const useTriggersData = () => {
  const exists = useExists('triggers.json')
  const raw = useJson('triggers.json')
  const [data, setData] = useState<TriggersData>()
  const dataRef = useRef<TriggersData | undefined>(undefined)

  useEffect(() => {
    if (raw !== undefined) {
      const parsedData = triggersDataSchema.parse(raw)
      if (!isEqual(dataRef.current, parsedData)) {
        setData(parsedData)
        dataRef.current = parsedData
      }
    }
  }, [raw])

  const loading = exists === null || (exists && raw === undefined)
  const error = exists === false ? 'triggers.json not found' : null

  return { data, loading, error }
}

export default useTriggersData
