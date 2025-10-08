export interface Position {
  x: number
  y: number
}

export interface NodeData {
  label: string
  type: string
  config?: Record<string, any>
}

// Workspace is the top level container
export interface Workspace {
  id: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Project can exist in a workspace and can also become a node in another project
export interface Project {
  id: string
  workspaceId: string
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Node represents a workflow node within a project
export interface WorkflowNode {
  id: string
  projectId: string
  position: Position
  data: NodeData
  // Reference to another project if this node represents a project
  linkedProjectId?: string
}

// Link represents connections between nodes (many-to-many)
export interface Link {
  id: string
  sourceNodeId: string
  targetNodeId: string
  projectId: string
  label?: string
  createdAt: Date
}

// Legacy Connection interface for backward compatibility
export interface Connection {
  id: string
  sourceId: string
  targetId: string
}

export interface WorkflowState {
  nodes: WorkflowNode[]
  connections: Connection[]
}

export type NodeType = 'trigger' | 'transform' | 'action' | 'condition' | 'project'

export interface NodeDefinition {
  type: NodeType
  label: string
  icon: string
  color: string
  description: string
}
