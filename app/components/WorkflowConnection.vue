<template>
  <g>
    <path
      :d="pathData"
      :stroke="isHovered ? '#3b82f6' : '#9ca3af'"
      :stroke-width="isHovered ? '3' : '2'"
      fill="none"
      stroke-linecap="round"
      class="connection-path"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @click="$emit('delete')"
    />
    <circle
      v-if="isHovered"
      :cx="midX"
      :cy="midY"
      r="10"
      fill="#ef4444"
      class="delete-handle"
      @click.stop="$emit('delete')"
    >
      <title>Delete connection</title>
    </circle>
  </g>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Connection, WorkflowNode } from '../types/workflow'

const props = defineProps<{
  connection: Connection
  nodes: WorkflowNode[]
}>()

defineEmits<{
  (e: 'delete'): void
}>()

const isHovered = ref(false)

const sourceNode = computed(() => 
  props.nodes.find(n => n.id === props.connection.sourceId)
)

const targetNode = computed(() => 
  props.nodes.find(n => n.id === props.connection.targetId)
)

const sourceX = computed(() => (sourceNode.value?.position.x || 0) + 200)
const sourceY = computed(() => (sourceNode.value?.position.y || 0) + 60)
const targetX = computed(() => (targetNode.value?.position.x || 0))
const targetY = computed(() => (targetNode.value?.position.y || 0) + 60)

const midX = computed(() => (sourceX.value + targetX.value) / 2)
const midY = computed(() => (sourceY.value + targetY.value) / 2)

const pathData = computed(() => {
  const sx = sourceX.value
  const sy = sourceY.value
  const tx = targetX.value
  const ty = targetY.value
  
  // Create a curved path
  const dx = tx - sx
  const dy = ty - sy
  const controlOffset = Math.abs(dx) / 2
  
  return `M ${sx} ${sy} C ${sx + controlOffset} ${sy}, ${tx - controlOffset} ${ty}, ${tx} ${ty}`
})
</script>

<style scoped>
.connection-path {
  cursor: pointer;
  transition: all 0.2s;
}

.connection-path:hover {
  stroke: #3b82f6;
  stroke-width: 3;
}

.delete-handle {
  cursor: pointer;
  transition: all 0.2s;
}

.delete-handle:hover {
  r: 12;
  fill: #dc2626;
}
</style>
