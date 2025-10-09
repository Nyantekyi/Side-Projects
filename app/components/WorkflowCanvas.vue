<template>
  <div class="workflow-canvas-container">
    <div class="toolbar">
      <h1 class="app-title">
        <span class="logo">⚡</span>
        Workflow Builder
      </h1>
      <div class="toolbar-actions">
        <button @click="executeWorkflow" class="btn btn-primary" title="Execute workflow">
          ▶ Execute
        </button>
        <button @click="clearWorkflow" class="btn btn-danger" title="Clear all nodes">
          🗑 Clear
        </button>
      </div>
    </div>
    
    <div 
      ref="canvasRef"
      class="workflow-canvas"
      @click="deselectAll"
      @drop="handleDrop"
      @dragover.prevent
    >
      <svg class="connections-layer">
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
        @quick-add-node="handleQuickAddNode(node)"
        @quick-connect="startConnecting(node.id)"
      />

      <div v-if="nodes.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h2>No nodes yet</h2>
        <p>Click on a node type in the sidebar or drag it to the canvas to get started</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useWorkflow } from '../composables/useWorkflow'
import { nodeDefinitions } from '../composables/useNodeDefinitions'
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
  addConnection,
  executeWorkflow,
  clearWorkflow
} = useWorkflow()

const canvasRef = ref<HTMLElement>()

const selectNode = (nodeId: string) => {
  selectedNode.value = nodeId
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
      type: nodeDef.type,
      config: getDefaultConfig(nodeDef.type)
    }
  }
  addNode(newNode)
  return newNode
}

const getDefaultConfig = (type: string): Record<string, any> => {
  switch (type) {
    case 'file-reader':
      return { directory: '/user/documents' }
    case 'filter':
      return { filterKey: 'type', filterValue: '' }
    case 'condition':
      return { condition: true }
    default:
      return {}
  }
}

const handleQuickAddNode = (sourceNode: any) => {
  // Add a transform node to the right of the current node
  const nodeDef = nodeDefinitions.find(def => def.type === 'transform')
  if (nodeDef) {
    const newNode = addNodeAtPosition(
      nodeDef, 
      sourceNode.position.x + 300, 
      sourceNode.position.y
    )
    // Automatically connect the source node to the new node
    addConnection(sourceNode.id, newNode.id)
  }
}

defineExpose({
  addNodeAtPosition
})
</script>

<style scoped>
.workflow-canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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

.toolbar-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.workflow-canvas {
  flex: 1;
  position: relative;
  background: 
    linear-gradient(90deg, #f3f4f6 1px, transparent 1px),
    linear-gradient(#f3f4f6 1px, transparent 1px);
  background-size: 20px 20px;
  overflow: auto;
  min-height: 600px;
}

.connections-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connections-layer > * {
  pointer-events: auto;
}

.empty-state {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #9ca3af;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h2 {
  font-size: 24px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 16px;
  color: #9ca3af;
  max-width: 400px;
}
</style>
