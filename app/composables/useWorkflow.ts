import { ref } from 'vue'
import type { WorkflowNode, Connection, WorkflowState } from '../types/workflow'

export const useWorkflow = () => {
  const nodes = ref<WorkflowNode[]>([])
  const connections = ref<Connection[]>([])
  const selectedNode = ref<string | null>(null)
  const isConnecting = ref(false)
  const connectingFrom = ref<string | null>(null)

  const addNode = (node: WorkflowNode) => {
    nodes.value.push(node)
  }

  const removeNode = (nodeId: string) => {
    nodes.value = nodes.value.filter(n => n.id !== nodeId)
    connections.value = connections.value.filter(
      c => c.sourceId !== nodeId && c.targetId !== nodeId
    )
  }

  const updateNodePosition = (nodeId: string, x: number, y: number) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) {
      node.position.x = x
      node.position.y = y
    }
  }

  const updateNodeData = (nodeId: string, data: any) => {
    const node = nodes.value.find(n => n.id === nodeId)
    if (node) {
      node.data = { ...node.data, ...data }
    }
  }

  const addConnection = (sourceId: string, targetId: string) => {
    // Check if connection already exists
    const exists = connections.value.some(
      c => c.sourceId === sourceId && c.targetId === targetId
    )
    if (!exists && sourceId !== targetId) {
      connections.value.push({
        id: `${sourceId}-${targetId}`,
        sourceId,
        targetId
      })
    }
  }

  const removeConnection = (connectionId: string) => {
    connections.value = connections.value.filter(c => c.id !== connectionId)
  }

  const startConnecting = (nodeId: string) => {
    isConnecting.value = true
    connectingFrom.value = nodeId
  }

  const finishConnecting = (targetId: string) => {
    if (connectingFrom.value && connectingFrom.value !== targetId) {
      addConnection(connectingFrom.value, targetId)
    }
    isConnecting.value = false
    connectingFrom.value = null
  }

  const cancelConnecting = () => {
    isConnecting.value = false
    connectingFrom.value = null
  }

  const executeWorkflow = async () => {
    // Simple execution: process nodes in order of connections
    const executed = new Set<string>()
    const results = new Map<string, any>()

    const executeNode = async (nodeId: string, input?: any): Promise<any> => {
      if (executed.has(nodeId)) {
        return results.get(nodeId)
      }

      const node = nodes.value.find(n => n.id === nodeId)
      if (!node) return null

      executed.add(nodeId)

      // Simple processing logic based on node type
      let output = input
      switch (node.data.type) {
        case 'trigger':
          output = { message: 'Workflow started', timestamp: Date.now() }
          break
        case 'transform':
          output = {
            ...input,
            transformed: true,
            nodeLabel: node.data.label
          }
          break
        case 'action':
          output = {
            ...input,
            action: `Executed ${node.data.label}`,
            timestamp: Date.now()
          }
          break
        case 'condition':
          output = {
            ...input,
            conditionMet: true,
            evaluatedBy: node.data.label
          }
          break
      }

      results.set(nodeId, output)

      // Execute connected nodes
      const outgoingConnections = connections.value.filter(c => c.sourceId === nodeId)
      for (const conn of outgoingConnections) {
        await executeNode(conn.targetId, output)
      }

      return output
    }

    // Find trigger nodes (nodes with no incoming connections)
    const triggerNodes = nodes.value.filter(node => 
      !connections.value.some(c => c.targetId === node.id)
    )

    console.log('Starting workflow execution...')
    for (const trigger of triggerNodes) {
      await executeNode(trigger.id)
    }

    console.log('Workflow execution completed!')
    console.log('Results:', Object.fromEntries(results))
    alert('Workflow executed! Check console for results.')
  }

  const clearWorkflow = () => {
    nodes.value = []
    connections.value = []
    selectedNode.value = null
  }

  return {
    nodes,
    connections,
    selectedNode,
    isConnecting,
    connectingFrom,
    addNode,
    removeNode,
    updateNodePosition,
    updateNodeData,
    addConnection,
    removeConnection,
    startConnecting,
    finishConnecting,
    cancelConnecting,
    executeWorkflow,
    clearWorkflow
  }
}
