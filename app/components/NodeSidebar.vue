<template>
  <aside class="node-sidebar">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Node Types</h2>
    </div>
    <div class="node-list">
      <UCard
        v-for="nodeDef in nodeDefinitions"
        :key="nodeDef.type"
        class="node-type-item"
        :ui="{ 
          body: { padding: '' },
          ring: '',
          divide: 'divide-y divide-gray-200'
        }"
        @click="addNode(nodeDef)"
        draggable="true"
        @dragstart="(e: DragEvent) => handleDragStart(e, nodeDef)"
      >
        <div class="node-type-header" :style="{ backgroundColor: nodeDef.color }">
          <span class="node-type-icon">{{ nodeDef.icon }}</span>
          <span class="node-type-label">{{ nodeDef.label }}</span>
        </div>
        <div class="node-type-description">
          {{ nodeDef.description }}
        </div>
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

<style scoped>
.node-sidebar {
  width: 280px;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
}

.sidebar-header {
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.node-type-item {
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.node-type-item:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.node-type-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.node-type-icon {
  font-size: 20px;
}

.node-type-label {
  flex: 1;
}

.node-type-description {
  padding: 12px 16px;
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}
</style>

