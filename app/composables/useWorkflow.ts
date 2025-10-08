import { ref } from 'vue'
import type { WorkflowNode, Link } from '../types/workflow'

export const useWorkflow = (projectId?: string) => {
  const nodes = ref<WorkflowNode[]>([])
  const links = ref<Link[]>([])
  const selectedNode = ref<string | null>(null)
  const isConnecting = ref(false)
  const connectingFrom = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch nodes for current project
  const fetchNodes = async (projId: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<WorkflowNode[]>('/api/nodes', {
        query: { projectId: projId }
      })
      nodes.value = data
    } catch (err) {
      error.value = 'Failed to fetch nodes'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // Fetch links for current project
  const fetchLinks = async (projId: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Link[]>('/api/links', {
        query: { projectId: projId }
      })
      links.value = data
    } catch (err) {
      error.value = 'Failed to fetch links'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const addNode = async (node: WorkflowNode) => {
    if (!node.projectId) return
    
    try {
      const newNode = await $fetch<WorkflowNode>('/api/nodes', {
        method: 'POST',
        body: node
      })
      nodes.value.push(newNode)
      return newNode
    } catch (err) {
      error.value = 'Failed to add node'
      console.error(err)
      throw err
    }
  }

  const removeNode = async (nodeId: string) => {
    try {
      await $fetch(`/api/nodes/${nodeId}`, { method: 'DELETE' })
      nodes.value = nodes.value.filter(n => n.id !== nodeId)
      links.value = links.value.filter(
        l => l.sourceNodeId !== nodeId && l.targetNodeId !== nodeId
      )
    } catch (err) {
      error.value = 'Failed to remove node'
      console.error(err)
      throw err
    }
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

  const addLink = async (sourceNodeId: string, targetNodeId: string, projId: string, label?: string) => {
    // Check if link already exists
    const exists = links.value.some(
      l => l.sourceNodeId === sourceNodeId && l.targetNodeId === targetNodeId
    )
    if (!exists && sourceNodeId !== targetNodeId) {
      try {
        const newLink = await $fetch<Link>('/api/links', {
          method: 'POST',
          body: { sourceNodeId, targetNodeId, projectId: projId, label }
        })
        links.value.push(newLink)
        return newLink
      } catch (err) {
        error.value = 'Failed to add link'
        console.error(err)
        throw err
      }
    }
  }

  const removeLink = async (linkId: string) => {
    try {
      await $fetch(`/api/links/${linkId}`, { method: 'DELETE' })
      links.value = links.value.filter(l => l.id !== linkId)
    } catch (err) {
      error.value = 'Failed to remove link'
      console.error(err)
      throw err
    }
  }

  const startConnecting = (nodeId: string) => {
    isConnecting.value = true
    connectingFrom.value = nodeId
  }

  const finishConnecting = async (targetId: string, projId: string) => {
    if (connectingFrom.value && connectingFrom.value !== targetId) {
      await addLink(connectingFrom.value, targetId, projId)
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
        case 'project':
          output = {
            ...input,
            projectNode: node.data.label,
            linkedProjectId: node.linkedProjectId
          }
          break
      }

      results.set(nodeId, output)

      // Execute connected nodes
      const outgoingLinks = links.value.filter(l => l.sourceNodeId === nodeId)
      for (const link of outgoingLinks) {
        await executeNode(link.targetNodeId, output)
      }

      return output
    }

    // Find trigger nodes (nodes with no incoming connections)
    const triggerNodes = nodes.value.filter(node => 
      !links.value.some(l => l.targetNodeId === node.id)
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
    links.value = []
    selectedNode.value = null
  }

  return {
    nodes,
    links,
    selectedNode,
    isConnecting,
    connectingFrom,
    loading,
    error,
    fetchNodes,
    fetchLinks,
    addNode,
    removeNode,
    updateNodePosition,
    updateNodeData,
    addLink,
    removeLink,
    startConnecting,
    finishConnecting,
    cancelConnecting,
    executeWorkflow,
    clearWorkflow
  }
}

