<template>
  <div class="app-container">
    <!-- Navigation Header with Nuxt UI -->
    <div class="nav-header">
      <div class="nav-content">
        <div class="nav-left">
          <h1 class="app-title">
            <span class="logo">⚡</span>
            Workflow Builder
          </h1>
          
          <!-- Workspace Selector -->
          <USelectMenu
            v-if="workspaces.length > 0"
            v-model="currentWorkspace"
            :options="workspaces"
            option-attribute="name"
            class="workspace-selector"
            placeholder="Select Workspace"
          >
            <template #leading>
              <span class="selector-label">
                🗂️ {{ currentWorkspace?.name || 'Select Workspace' }}
              </span>
            </template>
          </USelectMenu>
          
          <UButton
            icon="i-heroicons-plus"
            @click="isWorkspaceModalOpen = true"
            color="primary"
            variant="soft"
            size="sm"
          >
            New Workspace
          </UButton>
          
          <!-- Project Selector -->
          <USelectMenu
            v-if="projects.length > 0 && currentWorkspace"
            v-model="currentProject"
            :options="projects"
            option-attribute="name"
            class="project-selector"
            placeholder="Select Project"
          >
            <template #leading>
              <span class="selector-label">
                📁 {{ currentProject?.name || 'Select Project' }}
              </span>
            </template>
          </USelectMenu>
          
          <UButton
            v-if="currentWorkspace"
            icon="i-heroicons-plus"
            @click="isProjectModalOpen = true"
            color="primary"
            variant="soft"
            size="sm"
          >
            New Project
          </UButton>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="currentProject" class="workflow-app">
      <NodeSidebar @add-node="handleAddNode" />
      <WorkflowCanvas ref="canvasRef" :project-id="currentProject.id" />
    </div>
    
    <div v-else class="empty-workspace">
      <UCard>
        <template #header>
          <h2>Welcome to Workflow Builder</h2>
        </template>
        <div class="empty-content">
          <UIcon name="i-heroicons-folder-open" class="empty-icon" />
          <p v-if="!currentWorkspace">
            Create a workspace to get started
          </p>
          <p v-else>
            Create a project in {{ currentWorkspace.name }} to begin building workflows
          </p>
          <div class="empty-actions">
            <UButton
              v-if="!currentWorkspace"
              @click="isWorkspaceModalOpen = true"
              icon="i-heroicons-plus"
              size="lg"
            >
              Create Workspace
            </UButton>
            <UButton
              v-else
              @click="isProjectModalOpen = true"
              icon="i-heroicons-plus"
              size="lg"
            >
              Create Project
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Create Workspace Modal -->
    <UModal v-model="isWorkspaceModalOpen">
      <UCard>
        <template #header>
          <h3>Create New Workspace</h3>
        </template>
        <div class="modal-content">
          <UFormGroup label="Name" required>
            <UInput v-model="newWorkspaceName" placeholder="Enter workspace name" />
          </UFormGroup>
          <UFormGroup label="Description">
            <UTextarea v-model="newWorkspaceDescription" placeholder="Enter description (optional)" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="modal-actions">
            <UButton @click="isWorkspaceModalOpen = false" color="neutral" variant="ghost">
              Cancel
            </UButton>
            <UButton @click="handleCreateWorkspace" :loading="workspaceLoading">
              Create
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Create Project Modal -->
    <UModal v-model="isProjectModalOpen">
      <UCard>
        <template #header>
          <h3>Create New Project</h3>
        </template>
        <div class="modal-content">
          <UFormGroup label="Name" required>
            <UInput v-model="newProjectName" placeholder="Enter project name" />
          </UFormGroup>
          <UFormGroup label="Description">
            <UTextarea v-model="newProjectDescription" placeholder="Enter description (optional)" />
          </UFormGroup>
        </div>
        <template #footer>
          <div class="modal-actions">
            <UButton @click="isProjectModalOpen = false" color="neutral" variant="ghost">
              Cancel
            </UButton>
            <UButton @click="handleCreateProject" :loading="projectLoading">
              Create
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import NodeSidebar from '../components/NodeSidebar.vue'
import WorkflowCanvas from '../components/WorkflowCanvas.vue'
import type { NodeDefinition } from '../types/workflow'
import { useWorkspaces } from '../composables/useWorkspaces'
import { useProjects } from '../composables/useProjects'

const canvasRef = ref<InstanceType<typeof WorkflowCanvas>>()

// Workspace management
const {
  workspaces,
  currentWorkspace,
  loading: workspaceLoading,
  fetchWorkspaces,
  createWorkspace,
  setCurrentWorkspace
} = useWorkspaces()

// Project management
const {
  projects,
  currentProject,
  loading: projectLoading,
  fetchProjects,
  createProject,
  setCurrentProject
} = useProjects()

// Modal state
const isWorkspaceModalOpen = ref(false)
const isProjectModalOpen = ref(false)
const newWorkspaceName = ref('')
const newWorkspaceDescription = ref('')
const newProjectName = ref('')
const newProjectDescription = ref('')

// Watch for workspace changes to load projects
watch(currentWorkspace, async (workspace) => {
  if (workspace) {
    await fetchProjects(workspace.id)
  }
})

// Initialize data
onMounted(async () => {
  await fetchWorkspaces()
})

const handleAddNode = (nodeDef: NodeDefinition, x?: number, y?: number) => {
  canvasRef.value?.addNodeAtPosition(nodeDef, x || 400, y || 200)
}

const handleCreateWorkspace = async () => {
  if (!newWorkspaceName.value) return
  
  try {
    await createWorkspace(newWorkspaceName.value, newWorkspaceDescription.value)
    isWorkspaceModalOpen.value = false
    newWorkspaceName.value = ''
    newWorkspaceDescription.value = ''
  } catch (error) {
    console.error('Failed to create workspace:', error)
  }
}

const handleCreateProject = async () => {
  if (!newProjectName.value || !currentWorkspace.value) return
  
  try {
    await createProject(currentWorkspace.value.id, newProjectName.value, newProjectDescription.value)
    isProjectModalOpen.value = false
    newProjectName.value = ''
    newProjectDescription.value = ''
  } catch (error) {
    console.error('Failed to create project:', error)
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.nav-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.nav-content {
  padding: 16px 24px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.logo {
  font-size: 32px;
}

.workspace-selector,
.project-selector {
  min-width: 200px;
}

.selector-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.workflow-app {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.empty-workspace {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: linear-gradient(90deg, #f3f4f6 1px, transparent 1px),
    linear-gradient(#f3f4f6 1px, transparent 1px);
  background-size: 20px 20px;
}

.empty-content {
  text-align: center;
  padding: 32px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  color: #9ca3af;
}

.empty-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.empty-content p {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
}

.empty-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
