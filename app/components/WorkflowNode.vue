<template>
  <div
    :class="['workflow-node', { 
      'selected': isSelected, 
      'connecting': isConnecting,
      'status-running': node.data.status === 'running',
      'status-success': node.data.status === 'success',
      'status-error': node.data.status === 'error'
    }]"
    :style="{
      left: `${node.position.x}px`,
      top: `${node.position.y}px`,
      borderColor: nodeColor
    }"
    @mousedown="startDrag"
    @click.stop="selectNode"
  >
    <div class="node-header" :style="{ backgroundColor: nodeColor }">
      <span class="node-icon">{{ nodeIcon }}</span>
      <span class="node-type">{{ node.data.type }}</span>
      <span v-if="node.data.status === 'running'" class="status-indicator">⏳</span>
      <span v-if="node.data.status === 'success'" class="status-indicator">✓</span>
      <span v-if="node.data.status === 'error'" class="status-indicator">✗</span>
      <button class="delete-btn" @click.stop="$emit('delete')" title="Delete node">×</button>
    </div>
    <div class="node-body">
      <div class="node-label" contenteditable @blur="updateLabel" @click.stop @keydown.enter.prevent="blurOnEnter">
        {{ node.data.label }}
      </div>
      <button 
        v-if="nodeDef?.configurable"
        class="config-btn"
        @click.stop="toggleConfig"
        title="Configure node"
      >
        ⚙️
      </button>
    </div>
    
    <!-- Configuration Panel -->
    <div v-if="showConfig" class="config-panel" @click.stop>
      <div v-if="node.data.type === 'file-reader'" class="config-content">
        <label>Directory Path:</label>
        <input 
          type="text" 
          :value="node.data.config?.directory || '/user/documents'"
          @input="updateConfig('directory', ($event.target as HTMLInputElement).value)"
          placeholder="/path/to/directory"
        />
      </div>
      <div v-else-if="node.data.type === 'filter'" class="config-content">
        <label>Filter Key:</label>
        <input 
          type="text" 
          :value="node.data.config?.filterKey || 'type'"
          @input="updateConfig('filterKey', ($event.target as HTMLInputElement).value)"
          placeholder="type"
        />
        <label>Filter Value:</label>
        <input 
          type="text" 
          :value="node.data.config?.filterValue || ''"
          @input="updateConfig('filterValue', ($event.target as HTMLInputElement).value)"
          placeholder="json"
        />
      </div>
      <div v-else-if="node.data.type === 'condition'" class="config-content">
        <label>Condition:</label>
        <select 
          :value="node.data.config?.condition !== false ? 'true' : 'false'"
          @change="updateConfig('condition', ($event.target as HTMLSelectElement).value === 'true')"
        >
          <option value="true">Pass (true)</option>
          <option value="false">Block (false)</option>
        </select>
      </div>
      <button class="close-config" @click.stop="showConfig = false">Close</button>
    </div>

    <div class="node-footer">
      <button 
        class="connect-btn connect-output"
        @click.stop="$emit('startConnect')"
        title="Create connection from this node"
      >
        →
      </button>
      <button 
        class="connect-btn connect-input"
        @click.stop="$emit('finishConnect')"
        title="Create connection to this node"
      >
        ←
      </button>
    </div>
    
    <!-- Quick Actions -->
    <div class="quick-actions">
      <button 
        class="quick-action-btn"
        @click.stop="$emit('quickAddNode')"
        title="Add a new node after this one"
      >
        + Node
      </button>
      <button 
        class="quick-action-btn"
        @click.stop="$emit('quickConnect')"
        title="Quick connect to another node"
      >
        🔗 Link
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { WorkflowNode } from '../types/workflow'
import { nodeDefinitions } from '../composables/useNodeDefinitions'

const props = defineProps<{
  node: WorkflowNode
  isSelected: boolean
  isConnecting: boolean
}>()

const emit = defineEmits<{
  (e: 'update:position', x: number, y: number): void
  (e: 'update:data', data: any): void
  (e: 'select'): void
  (e: 'delete'): void
  (e: 'startConnect'): void
  (e: 'finishConnect'): void
  (e: 'quickAddNode'): void
  (e: 'quickConnect'): void
}>()

const showConfig = ref(false)

const nodeDef = computed(() => 
  nodeDefinitions.find(def => def.type === props.node.data.type)
)

const nodeColor = computed(() => nodeDef.value?.color || '#6b7280')
const nodeIcon = computed(() => nodeDef.value?.icon || '📦')

let isDragging = false
let startX = 0
let startY = 0
let initialX = 0
let initialY = 0

const startDrag = (e: MouseEvent) => {
  if ((e.target as HTMLElement).contentEditable === 'true') return
  if ((e.target as HTMLElement).tagName === 'INPUT') return
  if ((e.target as HTMLElement).tagName === 'SELECT') return
  
  isDragging = true
  startX = e.clientX
  startY = e.clientY
  initialX = props.node.position.x
  initialY = props.node.position.y

  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging) return
  
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  
  emit('update:position', initialX + dx, initialY + dy)
}

const stopDrag = () => {
  isDragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

const selectNode = () => {
  emit('select')
}

const updateLabel = (e: Event) => {
  const target = e.target as HTMLElement
  const newLabel = target.textContent?.trim() || props.node.data.label
  if (newLabel !== props.node.data.label) {
    emit('update:data', { label: newLabel })
  }
}

const blurOnEnter = (e: KeyboardEvent) => {
  (e.target as HTMLElement).blur()
}

const toggleConfig = () => {
  showConfig.value = !showConfig.value
}

const updateConfig = (key: string, value: any) => {
  const config = { ...(props.node.data.config || {}), [key]: value }
  emit('update:data', { config })
}
</script>

<style scoped>
.workflow-node {
  position: absolute;
  width: 200px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: move;
  transition: all 0.2s;
  user-select: none;
}

.workflow-node:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.workflow-node.selected {
  border-width: 3px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.workflow-node.connecting {
  cursor: crosshair;
}

.workflow-node.status-running {
  border-color: #fbbf24;
  animation: pulse 1.5s ease-in-out infinite;
}

.workflow-node.status-success {
  border-color: #10b981;
}

.workflow-node.status-error {
  border-color: #ef4444;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: white;
  border-radius: 6px 6px 0 0;
  font-weight: 600;
  font-size: 14px;
}

.node-icon {
  font-size: 18px;
}

.node-type {
  flex: 1;
  text-transform: capitalize;
}

.status-indicator {
  font-size: 14px;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.delete-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.node-body {
  padding: 12px;
  position: relative;
}

.node-label {
  font-size: 14px;
  color: #374151;
  outline: none;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
  min-height: 20px;
}

.node-label:focus {
  background: #f3f4f6;
}

.node-label:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
}

.config-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.config-btn:hover {
  background: #e5e7eb;
  transform: scale(1.1);
}

.config-panel {
  padding: 12px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.config-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-content label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.config-content input,
.config-content select {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  width: 100%;
}

.config-content input:focus,
.config-content select:focus {
  outline: none;
  border-color: #3b82f6;
}

.close-config {
  margin-top: 8px;
  padding: 4px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  width: 100%;
}

.close-config:hover {
  background: #2563eb;
}

.node-footer {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-top: 1px solid #e5e7eb;
  gap: 8px;
}

.connect-btn {
  flex: 1;
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.connect-btn:hover {
  background: #e5e7eb;
  transform: scale(1.05);
}

.connect-output {
  color: #10b981;
}

.connect-input {
  color: #3b82f6;
}

.quick-actions {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 0 0 6px 6px;
}

.quick-action-btn {
  flex: 1;
  padding: 6px 8px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s;
}

.quick-action-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  transform: translateY(-1px);
}
</style>
