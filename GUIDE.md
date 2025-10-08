# Workflow Builder - User Guide

## Overview
This is a visual workflow automation tool similar to n8n, allowing you to create, connect, and execute workflows using a drag-and-drop interface.

## Getting Started

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Visit http://localhost:3000

### Build for Production
```bash
npm run build
npm run preview
```

## How to Use

### 1. Adding Nodes
- **Click**: Click on any node type in the left sidebar to add it to the canvas
- **Drag & Drop**: Drag a node type from the sidebar and drop it on the canvas

### 2. Available Node Types

#### ⚡ Trigger (Green)
- Starts the workflow
- Initial data source
- No incoming connections needed

#### 🔄 Transform (Blue)
- Transforms data as it passes through
- Modifies the data structure
- Can have both input and output connections

#### ⚙️ Action (Purple)
- Performs an action with the data
- Executes specific operations
- Can be the end point or middle of a workflow

#### ❓ Condition (Orange)
- Evaluates conditions
- Can branch workflow logic
- Processes based on criteria

### 3. Moving Nodes
- Click and drag any node to reposition it on the canvas
- Nodes can be placed anywhere on the canvas

### 4. Editing Node Labels
- Click on a node's label text
- Type to edit the label
- Click outside or press Tab to save

### 5. Creating Connections

**Method 1: Button-based Connection**
1. Click the **→** (output) button on the source node
2. Click the **←** (input) button on the target node
3. A curved line will appear connecting the two nodes

**Tips:**
- You cannot connect a node to itself
- Duplicate connections are prevented automatically
- Data flows from left to right through connections

### 6. Deleting Elements

**Delete a Node:**
- Click the **×** button in the node's header
- All connections to/from that node will be removed automatically

**Delete a Connection:**
- Hover over the connection line
- Click the red circle that appears in the middle of the line

### 7. Executing the Workflow
1. Create your workflow with nodes and connections
2. Click the **▶ Execute** button in the toolbar
3. The workflow will process data through all connected nodes
4. Check the browser console (F12) to see execution results

### 8. Clearing the Canvas
- Click the **🗑 Clear** button to remove all nodes and connections
- Use this to start fresh with a new workflow

## Workflow Execution Logic

When you execute a workflow:

1. **Find Triggers**: The system identifies trigger nodes (nodes with no incoming connections)
2. **Start Execution**: Each trigger node begins processing
3. **Data Flow**: Data flows through connections in order:
   - Trigger generates initial data
   - Transform modifies the data
   - Action performs operations
   - Condition evaluates logic
4. **Results**: Check the console to see the data at each node

### Example Workflow

```
Trigger → Transform → Action
```

Result in console:
```javascript
{
  "trigger-node": {
    "message": "Workflow started",
    "timestamp": 1234567890
  },
  "transform-node": {
    "message": "Workflow started",
    "timestamp": 1234567890,
    "transformed": true,
    "nodeLabel": "Transform Node"
  },
  "action-node": {
    "message": "Workflow started",
    "timestamp": 1234567890,
    "transformed": true,
    "nodeLabel": "Transform Node",
    "action": "Executed Action Node",
    "timestamp": 1234567891
  }
}
```

## Keyboard Shortcuts

Currently, the app uses mouse-based interactions. Future versions may include:
- `Delete` key to remove selected nodes
- `Ctrl+Z` / `Cmd+Z` for undo
- `Ctrl+C` / `Cmd+C` for copy
- `Ctrl+V` / `Cmd+V` for paste

## Tips & Best Practices

1. **Plan Your Workflow**: Think about the data flow before adding nodes
2. **Name Your Nodes**: Give descriptive names to nodes for clarity
3. **Organize Layout**: Keep nodes in a logical left-to-right flow
4. **Test Often**: Execute workflows frequently to verify behavior
5. **Start Simple**: Begin with small workflows and expand gradually

## Troubleshooting

### Issue: Nodes are overlapping
**Solution**: Drag nodes to separate positions on the canvas

### Issue: Can't create a connection
**Possible causes:**
- Trying to connect a node to itself
- Connection already exists
- Didn't complete the two-step process (output → input)

### Issue: Workflow doesn't execute
**Check:**
- At least one trigger node exists
- Nodes are properly connected
- Check browser console for errors

### Issue: Can't see connection lines
**Solution:**
- Ensure nodes are properly connected
- Try refreshing the page
- Check that the canvas is scrolled to show both nodes

## Future Enhancements

Potential features for future versions:
- Save/Load workflows to/from JSON
- Export workflows
- Custom node types
- Advanced data processing
- Node configuration panels
- Workflow variables
- Error handling and debugging
- Parallel execution paths
- Conditional branching
- Loop nodes
- API integrations

## Architecture

### Component Structure
```
App
├── NodeSidebar (left panel)
│   └── Node type definitions
└── WorkflowCanvas (main area)
    ├── WorkflowNode (individual nodes)
    └── WorkflowConnection (connection lines)
```

### State Management
- Uses Vue 3 Composition API
- Centralized state with `useWorkflow` composable
- Reactive updates across all components

### Data Flow
```
User Action → Component Event → Composable State → UI Update
```

## Technical Details

- **Framework**: Nuxt 4 + Vue 3
- **Language**: TypeScript
- **Styling**: Scoped CSS with modern CSS3
- **State**: Composition API with ref/reactive
- **Build**: Vite for fast development and production builds

## Support

For issues, questions, or contributions, please refer to the project repository.

---

Happy workflow building! 🚀
