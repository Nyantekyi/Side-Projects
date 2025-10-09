import { ref } from 'vue'
import type { Project } from '../types/workflow'

export const useProjects = () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProjects = async (workspaceId: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Project[]>('/api/projects', {
        query: { workspaceId }
      })
      projects.value = data
      // Set first project as current if none selected
      if (!currentProject.value && data.length > 0) {
        currentProject.value = data[0] || null
      }
    } catch (err) {
      error.value = 'Failed to fetch projects'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createProject = async (workspaceId: string, name: string, description?: string) => {
    loading.value = true
    error.value = null
    try {
      const newProject = await $fetch<Project>('/api/projects', {
        method: 'POST',
        body: { workspaceId, name, description }
      })
      projects.value.push(newProject)
      currentProject.value = newProject
      return newProject
    } catch (err) {
      error.value = 'Failed to create project'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrentProject = (project: Project) => {
    currentProject.value = project
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    createProject,
    setCurrentProject
  }
}
