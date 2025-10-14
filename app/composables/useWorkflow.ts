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

    // Reset all node statuses
    nodes.value.forEach(node => {
      node.data.status = 'idle'
      node.data.result = undefined
    })

    const executeNode = async (nodeId: string, input?: any): Promise<any> => {
      if (executed.has(nodeId)) {
        return results.get(nodeId)
      }

      const node = nodes.value.find(n => n.id === nodeId)
      if (!node) return null

      executed.add(nodeId)
      node.data.status = 'running'

      try {
        // Simple processing logic based on node type
        let output = input
        switch (node.data.type) {
          case 'trigger':
            output = { message: 'Workflow started', timestamp: Date.now() }
            break
          case 'file-reader':
            // Simulate reading files from a directory
            const dirPath = node.data.config?.directory || '/user/documents'
            output = {
              ...input,
              files: await simulateFileRead(dirPath),
              directory: dirPath,
              processedBy: node.data.label
            }
            break
          case 'transform':
            output = {
              ...input,
              transformed: true,
              nodeLabel: node.data.label
            }
            break
          case 'filter':
            // Filter data based on config
            const filterKey = node.data.config?.filterKey || 'type'
            const filterValue = node.data.config?.filterValue || ''
            if (input?.files && Array.isArray(input.files)) {
              output = {
                ...input,
                files: input.files.filter((f: any) => 
                  filterValue ? f[filterKey] === filterValue : true
                ),
                filtered: true,
                filterApplied: { key: filterKey, value: filterValue }
              }
            } else {
              output = { ...input, filtered: true }
            }
            break
          case 'merge':
            // Merge would need multiple inputs - for now just pass through
            output = {
              ...input,
              merged: true,
              mergedBy: node.data.label
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
            const conditionMet = node.data.config?.condition !== false
            output = {
              ...input,
              conditionMet,
              evaluatedBy: node.data.label
            }
            break
          case 'output':
            output = {
              ...input,
              outputTo: node.data.config?.destination || 'console',
              displayedBy: node.data.label
            }
            console.log('📤 Output Node Result:', output)
            break
        }

        results.set(nodeId, output)
        node.data.result = output
        node.data.status = 'success'

        // Execute connected nodes
        const outgoingConnections = connections.value.filter(c => c.sourceId === nodeId)
        for (const conn of outgoingConnections) {
          await executeNode(conn.targetId, output)
        }

        return output
      } catch (error) {
        node.data.status = 'error'
        console.error(`Error executing node ${node.data.label}:`, error)
        throw error
      }
    }

    // Simulate file reading with different file types
    const simulateFileRead = async (directory: string) => {
      // Simulate different file types and their processing
      return [
        {
          name: 'document.txt',
          path: `${directory}/document.txt`,
          type: 'text',
          size: 1024,
          content: 'Sample text content',
          encoding: 'utf-8'
        },
        {
          name: 'data.json',
          path: `${directory}/data.json`,
          type: 'json',
          size: 2048,
          content: { key: 'value', items: [1, 2, 3] },
          parsed: true
        },
        {
          name: 'spreadsheet.csv',
          path: `${directory}/spreadsheet.csv`,
          type: 'csv',
          size: 4096,
          rows: 100,
          columns: ['id', 'name', 'value'],
          sample: [
            { id: 1, name: 'Item 1', value: 100 },
            { id: 2, name: 'Item 2', value: 200 }
          ]
        },
        {
          name: 'image.png',
          path: `${directory}/image.png`,
          type: 'image',
          size: 8192,
          format: 'png',
          dimensions: { width: 1920, height: 1080 }
        },
        {
          name: 'config.xml',
          path: `${directory}/config.xml`,
          type: 'xml',
          size: 512,
          content: '<config><setting>value</setting></config>'
        }
      ]
    }

    // Find trigger nodes (nodes with no incoming connections)
    const triggerNodes = nodes.value.filter(node => 
      !connections.value.some(c => c.targetId === node.id)
    )

    if (triggerNodes.length === 0) {
      alert('No trigger nodes found! Add a node without incoming connections to start.')
      return
    }

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

  const saveWorkflow = () => {
    const workflow: WorkflowState = {
      nodes: nodes.value,
      connections: connections.value
    }
    localStorage.setItem('workflow-builder-state', JSON.stringify(workflow))
    alert('Workflow saved successfully!')
  }

  const loadWorkflow = () => {
    const saved = localStorage.getItem('workflow-builder-state')
    if (saved) {
      try {
        const workflow: WorkflowState = JSON.parse(saved)
        nodes.value = workflow.nodes || []
        connections.value = workflow.connections || []
        selectedNode.value = null
        alert('Workflow loaded successfully!')
      } catch (error) {
        console.error('Failed to load workflow:', error)
        alert('Failed to load workflow. The saved data may be corrupted.')
      }
    } else {
      alert('No saved workflow found.')
    }
  }

  const exportWorkflow = () => {
    const workflow: WorkflowState = {
      nodes: nodes.value,
      connections: connections.value
    }
    const dataStr = JSON.stringify(workflow, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `workflow-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importWorkflow = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workflow: WorkflowState = JSON.parse(e.target?.result as string)
        nodes.value = workflow.nodes || []
        connections.value = workflow.connections || []
        selectedNode.value = null
        alert('Workflow imported successfully!')
      } catch (error) {
        console.error('Failed to import workflow:', error)
        alert('Failed to import workflow. The file may be invalid.')
      }
    }
    reader.readAsText(file)
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
    clearWorkflow,
    saveWorkflow,
    loadWorkflow,
    exportWorkflow,
    importWorkflow
  }
}
