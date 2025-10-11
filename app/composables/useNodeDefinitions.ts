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
    type: 'file-reader',
    label: 'File Reader',
    icon: '📁',
    color: '#14b8a6',
    description: 'Read files from a directory',
    configurable: true
  },
  {
    type: 'transform',
    label: 'Transform',
    icon: '🔄',
    color: '#3b82f6',
    description: 'Transform data'
  },
  {
    type: 'filter',
    label: 'Filter',
    icon: '🔍',
    color: '#06b6d4',
    description: 'Filter data based on conditions',
    configurable: true
  },
  {
    type: 'merge',
    label: 'Merge',
    icon: '🔀',
    color: '#6366f1',
    description: 'Merge multiple data streams'
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
    description: 'Conditional logic',
    configurable: true
  },
  {
    type: 'output',
    label: 'Output',
    icon: '📤',
    color: '#ec4899',
    description: 'Display or export results'
  }
]

