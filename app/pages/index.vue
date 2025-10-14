<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <NodeSidebar @add-node="handleAddNode" />
    <WorkflowCanvas ref="canvasRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NodeSidebar from '../components/NodeSidebar.vue'
import WorkflowCanvas from '../components/WorkflowCanvas.vue'
import type { NodeDefinition } from '../types/workflow'

const canvasRef = ref<InstanceType<typeof WorkflowCanvas>>()

const handleAddNode = (nodeDef: NodeDefinition, x?: number, y?: number) => {
  canvasRef.value?.addNodeAtPosition(nodeDef, x || 400, y || 200)
}
</script>
