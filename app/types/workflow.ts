export interface Position {
  x: number
  y: number
}

export interface NodeData {
  label: string
  type: string
  config?: Record<string, any>
  status?: 'idle' | 'running' | 'success' | 'error'
  result?: any
}

export interface WorkflowNode {
  id: string
  position: Position
  data: NodeData
}

export interface Connection {
  id: string
  sourceId: string
  targetId: string
}

export interface WorkflowState {
  nodes: WorkflowNode[]
  connections: Connection[]
}

export type NodeType = 'trigger' | 'transform' | 'action' | 'condition' | 'file-reader' | 'filter' | 'merge' | 'output'

export interface NodeDefinition {
  type: NodeType
  label: string
  icon: string
  color: string
  description: string
  configurable?: boolean
}
