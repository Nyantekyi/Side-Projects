import { ref } from 'vue'
import type { Workspace, Project } from '../types/workflow'

export const useWorkspaces = () => {
  const workspaces = ref<Workspace[]>([])
  const currentWorkspace = ref<Workspace | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchWorkspaces = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Workspace[]>('/api/workspaces')
      workspaces.value = data
      // Set first workspace as current if none selected
      if (!currentWorkspace.value && data.length > 0) {
        currentWorkspace.value = data[0] || null
      }
    } catch (err) {
      error.value = 'Failed to fetch workspaces'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createWorkspace = async (name: string, description?: string) => {
    loading.value = true
    error.value = null
    try {
      const newWorkspace = await $fetch<Workspace>('/api/workspaces', {
        method: 'POST',
        body: { name, description }
      })
      workspaces.value.push(newWorkspace)
      currentWorkspace.value = newWorkspace
      return newWorkspace
    } catch (err) {
      error.value = 'Failed to create workspace'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentWorkspace = (workspace: Workspace) => {
    currentWorkspace.value = workspace
  }

  return {
    workspaces,
    currentWorkspace,
    loading,
    error,
    fetchWorkspaces,
    createWorkspace,
    setCurrentWorkspace
  }
}
