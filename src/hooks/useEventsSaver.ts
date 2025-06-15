import { useArtifact } from '@artifact/client/hooks'
import type { EventsData } from '../types/events.ts'

const useEventsSaver = () => {
  const artifact = useArtifact()

  return async (data: EventsData): Promise<void> => {
    artifact.files.write.json('events.json', data)
    await artifact.branch.write.commit('Update events data')
  }
}

export default useEventsSaver