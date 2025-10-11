<template>
  <div class="flex flex-col flex-1 h-screen overflow-hidden">
    <div class="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div class="flex items-center gap-3">
        <span class="text-4xl">⚡</span>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Workflow Builder</h1>
          <p class="text-sm text-gray-600">Visual automation tool</p>
        </div>
      </div>
      <div class="flex gap-3">
        <UButton 
          @click="saveWorkflow" 
          size="lg"
          color="green"
          variant="soft"
        >
          💾 Save
        </UButton>
        <UButton 
          @click="loadWorkflow"
          size="lg"
          color="blue"
          variant="soft"
        >
          📂 Load
        </UButton>
        <UButton 
          @click="exportWorkflow"
          size="lg"
          color="indigo"
          variant="soft"
        >
          📤 Export
        </UButton>
        <UButton 
          @click="triggerImport"
          size="lg"
          color="violet"
          variant="soft"
        >
          📥 Import
        </UButton>
        <UButton 
          @click="executeWorkflow" 
          size="lg"
          color="primary"
          variant="solid"
        >
          ▶ Execute
        </UButton>
        <UButton 
          @click="clearWorkflow"
          size="lg"
          color="red"
          variant="soft"
        >
          🗑 Clear
        </UButton>
      </div>
    </div>
    
    <div 
      ref="canvasRef"
      class="flex-1 relative overflow-auto bg-gray-50"
      style="background-image: radial-gradient(circle, #d1d5db 1px, transparent 1px); background-size: 24px 24px;"
      @click="deselectAll"
      @drop="handleDrop"
      @dragover.prevent
    >
      <svg class="absolute top-0 left-0 w-full h-full pointer-events-none">
        <WorkflowConnection
          v-for="connection in connections"
          :key="connection.id"
          :connection="connection"
          :nodes="nodes"
          @delete="removeConnection(connection.id)"
        />
      </svg>
      
      <WorkflowNode
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :is-selected="selectedNode === node.id"
        :is-connecting="isConnecting"
        @update:position="(x, y) => updateNodePosition(node.id, x, y)"
        @update:data="(data) => updateNodeData(node.id, data)"
        @select="selectNode(node.id)"
        @delete="removeNode(node.id)"
        @start-connect="startConnecting(node.id)"
        @finish-connect="finishConnecting(node.id)"
      />

      <div v-if="nodes.length === 0" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div class="text-6xl mb-4">📋</div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">No nodes yet</h2>
        <p class="text-gray-500 max-w-md">Click on a node type in the sidebar or drag it to the canvas to get started</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useWorkflow } from '../composables/useWorkflow'
import type { NodeDefinition } from '../types/workflow'
import WorkflowNode from './WorkflowNode.vue'
import WorkflowConnection from './WorkflowConnection.vue'

const {
  nodes,
  connections,
  selectedNode,
  isConnecting,
  addNode,
  removeNode,
  updateNodePosition,
  updateNodeData,
  startConnecting,
  finishConnecting,
  cancelConnecting,
  removeConnection,
  executeWorkflow,
  clearWorkflow,
  saveWorkflow,
  loadWorkflow,
  exportWorkflow,
  importWorkflow
} = useWorkflow()

const canvasRef = ref<HTMLElement>()
const fileInputRef = ref<HTMLInputElement>()

const selectNode = (nodeId: string) => {
  selectedNode.value = nodeId
}

const triggerImport = () => {
  if (!fileInputRef.value) {
    // Create a hidden file input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        importWorkflow(file)
      }
    }
    input.click()
  } else {
    fileInputRef.value.click()
  }
}

const deselectAll = () => {
  selectedNode.value = null
  if (isConnecting.value) {
    cancelConnecting()
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  
  const data = e.dataTransfer?.getData('application/json')
  if (!data || !canvasRef.value) return
  
  const nodeDef = JSON.parse(data) as NodeDefinition
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left - 100
  const y = e.clientY - rect.top - 60
  
  addNodeAtPosition(nodeDef, x, y)
}

const addNodeAtPosition = (nodeDef: NodeDefinition, x: number, y: number) => {
  const newNode = {
    id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    position: { x, y },
    data: {
      label: `${nodeDef.label} Node`,
      type: nodeDef.type
    }
  }
  addNode(newNode)
}

// Keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  // Delete key - remove selected node
  if (e.key === 'Delete' && selectedNode.value) {
    removeNode(selectedNode.value)
    selectedNode.value = null
  }
  
  // Escape key - deselect and cancel connections
  if (e.key === 'Escape') {
    deselectAll()
  }
  
  // Ctrl+S / Cmd+S - Save workflow
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault()
    saveWorkflow()
  }
  
  // Ctrl+O / Cmd+O - Load workflow
  if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
    e.preventDefault()
    loadWorkflow()
  }
  
  // Ctrl+E / Cmd+E - Export workflow
  if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
    e.preventDefault()
    exportWorkflow()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

defineExpose({
  addNodeAtPosition
})
</script>
