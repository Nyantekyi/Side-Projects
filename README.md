# Workflow Builder - n8n-like Automation App

A visual workflow automation builder similar to n8n, built with Vue.js 3 and Nuxt 4.

## Features

- 🎨 **Visual Canvas**: Drag-and-drop interface for creating workflows
- 🔗 **Node Connections**: Create links between nodes to define workflow logic
- ⚡ **Multiple Node Types**:
  - Trigger: Start the workflow
  - Transform: Transform data
  - Action: Perform actions
  - Condition: Conditional logic
- 🎯 **Interactive Nodes**: Edit node labels inline
- 🚀 **Workflow Execution**: Execute workflows and see results in console
- 💾 **Real-time State Management**: All changes are reflected immediately

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm 10+

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Add Nodes**: Click on a node type in the sidebar or drag it to the canvas
2. **Move Nodes**: Click and drag nodes to reposition them
3. **Connect Nodes**: 
   - Click the "→" button on a source node to start connecting
   - Click the "←" button on a target node to complete the connection
4. **Edit Nodes**: Click on a node's label to edit it inline
5. **Delete Nodes**: Click the "×" button on a node to remove it
6. **Delete Connections**: Hover over a connection and click the red circle to delete it
7. **Execute Workflow**: Click the "▶ Execute" button to run your workflow
8. **Clear Canvas**: Click the "🗑 Clear" button to remove all nodes

## Architecture

- **Vue 3**: Composition API for reactive components
- **Nuxt 4**: Server-side rendering and routing
- **TypeScript**: Type-safe code
- **Composables**: Shared state management with `useWorkflow`
- **Component-based**: Modular, reusable components

## Project Structure

```
app/
├── components/
│   ├── NodeSidebar.vue         # Sidebar with available node types
│   ├── WorkflowCanvas.vue      # Main canvas for workflow
│   ├── WorkflowNode.vue        # Individual node component
│   └── WorkflowConnection.vue  # Connection line between nodes
├── composables/
│   ├── useWorkflow.ts          # Workflow state management
│   └── useNodeDefinitions.ts  # Node type definitions
├── types/
│   └── workflow.ts             # TypeScript interfaces
├── pages/
│   └── index.vue               # Main page
└── app.vue                     # Root component
```

## License

MIT

