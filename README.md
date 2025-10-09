# Workflow Builder - n8n-like Automation App

A visual workflow automation builder similar to n8n, built with Vue.js 3, Nuxt 4, and Nuxt UI with a hierarchical workspace structure.

## Features

- 🗂️ **Hierarchical Organization**: Workspaces → Projects → Nodes → Links
- 🎨 **Visual Canvas**: Drag-and-drop interface for creating workflows
- 🔗 **Many-to-Many Links**: Create multiple connections between nodes
- ⚡ **Multiple Node Types**:
  - Trigger: Start the workflow
  - Transform: Transform data
  - Action: Perform actions
  - Condition: Conditional logic
  - Project: Reference another project as a node (projects can become nodes!)
- 🎯 **Interactive Nodes**: Edit node labels inline
- 🚀 **Workflow Execution**: Execute workflows and see results in console
- 💾 **Persistent Storage**: Mock database for development (Neo4j-ready backend)
- 🎨 **Modern UI**: Redesigned with Nuxt UI components
- 🔄 **Real-time Updates**: All changes are reflected immediately

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm 10+
- (Optional) Neo4j database for production use

### Installation

```bash
# Install dependencies
npm install
```

### Configuration

The app uses a mock database by default for development. To use Neo4j:

1. Copy `.env.example` to `.env`
2. Update Neo4j connection details:
```bash
NEO4J_URI=neo4j://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```
3. Update server API endpoints to use `db.ts` instead of `mockDb.ts`

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

### 1. Create a Workspace
- Click "New Workspace" in the header
- Enter a name and optional description
- Click "Create"

### 2. Create a Project
- Select your workspace from the dropdown
- Click "New Project"
- Enter project name and description
- Click "Create"

### 3. Add Nodes
- Click on a node type in the sidebar or drag it to the canvas
- Available node types:
  - **⚡ Trigger**: Start the workflow
  - **🔄 Transform**: Transform data as it passes through
  - **⚙️ Action**: Perform an action with the data
  - **❓ Condition**: Evaluate conditions and branch logic
  - **📁 Project**: Reference another project as a node (enabling project reuse!)

### 4. Move Nodes
- Click and drag nodes to reposition them on the canvas

### 5. Connect Nodes (Create Links)
- Click the "→" button on a source node to start connecting
- Click the "←" button on a target node to complete the link
- Links support many-to-many relationships

### 6. Edit Nodes
- Click on a node's label to edit it inline

### 7. Delete Nodes & Links
- Click the "×" button on a node to remove it
- Hover over a link and click the red circle to delete it

### 8. Execute Workflow
- Click the "▶ Execute" button to run your workflow
- Check the browser console (F12) to see execution results

### 9. Clear Canvas
- Click the "🗑 Clear" button to remove all nodes and links
- Use this to start fresh with a new workflow

## Architecture

### Hierarchical Data Model

```
Workspaces (Top Level)
    └── Projects (Can contain nodes OR become a node in another project)
        └── Nodes (Workflow components)
            └── Links (Many-to-many connections between nodes)
```

**Key Features:**
- Projects can be referenced as nodes in other projects, enabling workflow composition
- Links support many-to-many relationships between nodes
- Each level maintains its own context and data

### Technology Stack

- **Frontend Framework**: Nuxt 4 + Vue 3
- **UI Library**: Nuxt UI (Tailwind CSS + Headless UI)
- **Language**: TypeScript
- **State Management**: Vue 3 Composition API with composables
- **Backend**: Nitro server with API routes
- **Database**: Mock database (development) / Neo4j (production-ready)
- **Build Tool**: Vite

### Component Structure
```
App
├── Pages
│   └── index.vue (Main page with workspace/project selection)
├── Components
│   ├── NodeSidebar.vue (Node type selector)
│   ├── WorkflowCanvas.vue (Main canvas area)
│   ├── WorkflowNode.vue (Individual node)
│   └── WorkflowConnection.vue (Link visualization)
├── Composables
│   ├── useWorkspaces.ts (Workspace management)
│   ├── useProjects.ts (Project management)
│   ├── useWorkflow.ts (Node & link management)
│   └── useNodeDefinitions.ts (Node type definitions)
└── Server
    ├── api/
    │   ├── workspaces/ (CRUD endpoints)
    │   ├── projects/ (CRUD endpoints)
    │   ├── nodes/ (CRUD endpoints)
    │   └── links/ (CRUD endpoints)
    └── utils/
        ├── db.ts (Neo4j integration)
        └── mockDb.ts (In-memory mock database)
```

### State Management
- Uses Vue 3 Composition API
- Centralized state with composables (`useWorkspaces`, `useProjects`, `useWorkflow`)
- Reactive updates across all components
- Server-side persistence via API routes

### Data Flow
```
User Action → Component Event → Composable → API Call → Database → State Update → UI Update
```

## License

MIT

