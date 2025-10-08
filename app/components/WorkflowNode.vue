<template>
  <div
    :class="['workflow-node', { 'selected': isSelected, 'connecting': isConnecting }]"
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
      <button class="delete-btn" @click.stop="$emit('delete')" title="Delete node">×</button>
    </div>
    <div class="node-body">
      <div class="node-label" contenteditable @blur="updateLabel" @click.stop>
        {{ node.data.label }}
      </div>
    </div>
    <div class="node-footer">
      <button 
        class="connect-btn connect-output"
        @click.stop="$emit('startConnect')"
        title="Create connection"
      >
        →
      </button>
      <button 
        class="connect-btn connect-input"
        @click.stop="$emit('finishConnect')"
        title="Finish connection"
      >
        ←
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
}>()

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
  emit('update:data', { label: newLabel })
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
}

.node-label {
  font-size: 14px;
  color: #374151;
  outline: none;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;
}

.node-label:focus {
  background: #f3f4f6;
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
</style>
