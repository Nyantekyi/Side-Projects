import type { NodeDefinition } from '../types/workflow'

export const nodeDefinitions: NodeDefinition[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    icon: '⚡',
    color: '#10b981',
    description: 'Start the workflow'
  },
  {
    type: 'transform',
    label: 'Transform',
    icon: '🔄',
    color: '#3b82f6',
    description: 'Transform data'
  },
  {
    type: 'action',
    label: 'Action',
    icon: '⚙️',
    color: '#8b5cf6',
    description: 'Perform an action'
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: '❓',
    color: '#f59e0b',
    description: 'Conditional logic'
  },
  {
    type: 'project',
    label: 'Project',
    icon: '📁',
    color: '#ec4899',
    description: 'Reference another project as a node'
  }
]

