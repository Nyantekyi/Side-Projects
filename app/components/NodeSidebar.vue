<template>
  <aside class="w-80 bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
    <div class="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
      <h2 class="text-xl font-bold text-gray-900">Node Types</h2>
      <p class="text-sm text-gray-600 mt-1">Drag to canvas or click to add</p>
    </div>
    <div class="p-4 space-y-3">
      <UCard
        v-for="nodeDef in nodeDefinitions"
        :key="nodeDef.type"
        class="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2"
        :style="{ borderColor: nodeDef.color }"
        @click="addNode(nodeDef)"
        draggable="true"
        @dragstart="(e) => handleDragStart(e, nodeDef)"
      >
        <div class="flex items-center gap-3 p-2 rounded-lg text-white font-semibold" :style="{ backgroundColor: nodeDef.color }">
          <span class="text-2xl">{{ nodeDef.icon }}</span>
          <span class="flex-1">{{ nodeDef.label }}</span>
        </div>
        <p class="text-sm text-gray-600 mt-3">{{ nodeDef.description }}</p>
      </UCard>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { nodeDefinitions } from '../composables/useNodeDefinitions'
import type { NodeDefinition } from '../types/workflow'

const emit = defineEmits<{
  (e: 'addNode', nodeDef: NodeDefinition, x?: number, y?: number): void
}>()

const addNode = (nodeDef: NodeDefinition) => {
  // Add node at center of canvas
  emit('addNode', nodeDef, 400, 200)
}

const handleDragStart = (e: DragEvent, nodeDef: NodeDefinition) => {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'copy'
    e.dataTransfer.setData('application/json', JSON.stringify(nodeDef))
  }
}
</script>
