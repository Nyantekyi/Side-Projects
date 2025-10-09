<template>
  <div
    :class="[
      'absolute w-64 bg-white rounded-xl shadow-lg border-2 transition-all duration-200 cursor-move select-none',
      isSelected ? 'ring-4 ring-primary-400 ring-opacity-50 shadow-2xl scale-105' : 'hover:shadow-xl hover:-translate-y-1',
      isConnecting ? 'cursor-crosshair' : ''
    ]"
    :style="{
      left: `${node.position.x}px`,
      top: `${node.position.y}px`,
      borderColor: nodeColor
    }"
    @mousedown="startDrag"
    @click.stop="selectNode"
  >
    <div class="flex items-center gap-2 px-4 py-3 text-white rounded-t-lg font-semibold" :style="{ backgroundColor: nodeColor }">
      <span class="text-xl">{{ nodeIcon }}</span>
      <span class="flex-1 capitalize">{{ node.data.type }}</span>
      <button 
        class="w-6 h-6 rounded hover:bg-white/20 transition-colors text-white font-bold"
        @click.stop="$emit('delete')"
        title="Delete node"
      >
        ×
      </button>
    </div>
    
    <div class="p-4">
      <div 
        class="text-sm text-gray-700 outline-none px-2 py-1 rounded transition-colors hover:bg-gray-50 focus:bg-gray-100 focus:ring-2 focus:ring-primary-500" 
        contenteditable 
        @blur="updateLabel" 
        @click.stop
      >
        {{ node.data.label }}
      </div>
    </div>
    
    <div class="flex gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <UButton 
        class="flex-1"
        color="green"
        variant="soft"
        size="sm"
        @click.stop="$emit('startConnect')"
      >
        → Output
      </UButton>
      <UButton 
        class="flex-1"
        color="blue"
        variant="soft"
        size="sm"
        @click.stop="$emit('finishConnect')"
      >
        ← Input
      </UButton>
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
