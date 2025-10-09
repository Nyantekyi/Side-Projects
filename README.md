# Workflow Builder - n8n-like Automation App

A visual workflow automation builder similar to n8n, built with Vue.js 3 and Nuxt 4.

## Features

- 🎨 **Visual Canvas**: Drag-and-drop interface for creating workflows
- 🔗 **Node Connections**: Create links between nodes to define workflow logic
- ⚡ **Multiple Node Types**:
  - Trigger: Start the workflow
  - File Reader: Read and process files from directories
  - Transform: Transform data
  - Filter: Filter data based on conditions
  - Merge: Merge multiple data streams
  - Action: Perform actions
  - Condition: Conditional logic
  - Output: Display or export results
- 🎯 **Interactive Nodes**: Edit node labels inline and configure node settings
- 🔧 **Quick Actions**: Add connected nodes or create links with one click
- 📁 **File Processing**: Read and process different file types (text, JSON, CSV, XML, images)
- 📊 **Visual Execution Status**: Real-time status indicators showing node execution state
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
3. **Configure Nodes**: Click the "⚙️" button on configurable nodes to set options
4. **Quick Actions**:
   - Click "+ Node" to automatically add and connect a Transform node
   - Click "🔗 Link" to start connection mode
5. **Connect Nodes**: 
   - Click the "→" button on a source node to start connecting
   - Click the "←" button on a target node to complete the connection
6. **Edit Nodes**: Click on a node's label to edit it inline (press Enter to save)
7. **Delete Nodes**: Click the "×" button on a node to remove it
8. **Delete Connections**: Hover over a connection and click the red circle to delete it
9. **Execute Workflow**: Click the "▶ Execute" button to run your workflow
10. **Clear Canvas**: Click the "🗑 Clear" button to remove all nodes

### File Reader Node

The File Reader node reads files from a specified directory and processes them based on file type:

- **Text files** (.txt): Extracts content and encoding information
- **JSON files** (.json): Parses JSON and validates structure
- **CSV files** (.csv): Extracts columns, rows, and sample data
- **Image files** (.png, .jpg): Extracts dimensions and format
- **XML files** (.xml): Reads XML content

Configure the directory path in the node's settings panel.

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

