import { useArtifact } from '@artifact/client/hooks'
import type { TriggersData } from '../types/triggers'

const useTriggersSaver = () => {
  const artifact = useArtifact()

  return async (data: TriggersData): Promise<void> => {
    artifact.files.write.json('triggers.json', data)
    await artifact.branch.write.commit('Update triggers data')
  }
}

export default useTriggersSaver
