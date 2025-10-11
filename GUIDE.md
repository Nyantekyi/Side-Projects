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

#### 📁 File Reader (Teal)
- Reads files from a specified directory
- Processes different file types automatically
- **Configurable**: Set directory path
- Supported file types:
  - Text files (.txt): Content and encoding
  - JSON files (.json): Parsed JSON structure
  - CSV files (.csv): Rows, columns, and sample data
  - Images (.png, .jpg): Dimensions and format
  - XML files (.xml): XML content

#### 🔄 Transform (Blue)
- Transforms data as it passes through
- Modifies the data structure
- Can have both input and output connections

#### 🔍 Filter (Cyan)
- Filters data based on conditions
- **Configurable**: Set filter key and value
- Useful for processing file lists or data arrays

#### 🔀 Merge (Indigo)
- Merges multiple data streams
- Combines data from different sources
- Can accept multiple inputs

#### ⚙️ Action (Purple)
- Performs an action with the data
- Executes specific operations
- Can be the end point or middle of a workflow

#### ❓ Condition (Orange)
- Evaluates conditions
- **Configurable**: Set pass/block condition
- Can branch workflow logic
- Processes based on criteria

#### 📤 Output (Pink)
- Displays or exports results
- Final destination for workflow data
- Logs results to console

### 3. Moving Nodes
- Click and drag any node to reposition it on the canvas
- Nodes can be placed anywhere on the canvas

### 4. Editing Node Labels
- Click on a node's label text
- Type to edit the label
- Press Enter or click outside to save

### 5. Configuring Nodes

Some nodes have configuration options:

**To Configure a Node:**
1. Look for the **⚙️** button in the node (only configurable nodes have this)
2. Click the gear button to open the configuration panel
3. Adjust settings as needed:
   - **File Reader**: Set directory path (e.g., `/user/documents`)
   - **Filter**: Set filter key and value (e.g., filter by `type` = `json`)
   - **Condition**: Choose to pass or block data
4. Click "Close" to save and exit

### 6. Quick Actions

Each node has quick action buttons at the bottom:

**+ Node Button:**
- Automatically adds a Transform node to the right
- Connects it to the current node
- Saves time when building linear workflows

**🔗 Link Button:**
- Starts connection mode from the current node
- Click on another node's input button to complete

### 7. Creating Connections

**Method 1: Button-based Connection**
1. Click the **→** (output) button on the source node
2. Click the **←** (input) button on the target node
3. A curved line will appear connecting the two nodes

**Method 2: Quick Link**
1. Click the **🔗 Link** button on the source node
2. Click the **←** (input) button on the target node

**Tips:**
- You cannot connect a node to itself
- Duplicate connections are prevented automatically
- Data flows from left to right through connections

### 8. Deleting Elements

**Delete a Node:**
- Click the **×** button in the node's header
- All connections to/from that node will be removed automatically

**Delete a Connection:**
- Hover over the connection line
- Click the red circle that appears in the middle of the line

### 9. Executing the Workflow
1. Create your workflow with nodes and connections
2. Click the **▶ Execute** button in the toolbar
3. Watch as nodes show execution status:
   - ⏳ Running (with pulse animation)
   - ✓ Success (green border)
   - ✗ Error (red border)
4. Check the browser console (F12) to see detailed results

### 10. Clearing the Canvas
- Click the **🗑 Clear** button to remove all nodes and connections
- Use this to start fresh with a new workflow

## Workflow Execution Logic

When you execute a workflow:

1. **Find Triggers**: The system identifies trigger nodes (nodes with no incoming connections)
2. **Status Reset**: All node statuses are reset to idle
3. **Start Execution**: Each trigger node begins processing
4. **Real-time Updates**: Nodes update their status in real-time:
   - **Running** (⏳): Node is currently processing
   - **Success** (✓): Node completed successfully
   - **Error** (✗): Node encountered an error
5. **Data Flow**: Data flows through connections in order:
   - Trigger generates initial data
   - File Reader reads and processes files
   - Transform modifies the data
   - Filter removes unwanted data
   - Action performs operations
   - Condition evaluates logic
   - Output displays results
6. **Results**: Check the console to see the data at each node

### Example Workflows

#### File Processing Workflow

```
File Reader → Filter → Output
```

Result in console:
```javascript
{
  "file-reader-node": {
    "files": [
      {
        "name": "document.txt",
        "type": "text",
        "size": 1024,
        "content": "Sample text content",
        "encoding": "utf-8"
      },
      {
        "name": "data.json",
        "type": "json",
        "size": 2048,
        "content": {"key": "value"},
        "parsed": true
      }
    ],
    "directory": "/user/documents"
  },
  "filter-node": {
    "files": [
      {
        "name": "data.json",
        "type": "json",
        ...
      }
    ],
    "filtered": true,
    "filterApplied": {"key": "type", "value": "json"}
  },
  "output-node": {
    "outputTo": "console",
    "displayedBy": "Output Node"
  }
}
```

#### Simple Data Flow

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

- **Enter**: When editing a node label, press Enter to save and exit edit mode
- **Escape**: Cancel connection mode (if active)

Future versions may include:
- `Delete` key to remove selected nodes
- `Ctrl+Z` / `Cmd+Z` for undo
- `Ctrl+C` / `Cmd+C` for copy
- `Ctrl+V` / `Cmd+V` for paste

## Tips & Best Practices

1. **Plan Your Workflow**: Think about the data flow before adding nodes
2. **Name Your Nodes**: Give descriptive names to nodes for clarity
3. **Use Quick Actions**: Use the "+ Node" button to quickly build linear workflows
4. **Configure Before Executing**: Set up node configurations before running the workflow
5. **Organize Layout**: Keep nodes in a logical left-to-right flow
6. **Test Often**: Execute workflows frequently to verify behavior
7. **Start Simple**: Begin with small workflows and expand gradually
8. **Watch Status Indicators**: Monitor the checkmarks and status icons during execution
9. **Check Console**: Always check the browser console for detailed execution results

## Troubleshooting

### Issue: Nodes are overlapping
**Solution**: Drag nodes to separate positions on the canvas. The quick "+ Node" action positions nodes automatically to avoid overlap.

### Issue: Can't create a connection
**Possible causes:**
- Trying to connect a node to itself
- Connection already exists
- Didn't complete the two-step process (output → input)

**Solution**: Use the quick "🔗 Link" button for easier connection creation.

### Issue: Workflow doesn't execute
**Check:**
- At least one trigger node exists (nodes with no incoming connections)
- The system will alert you if no trigger nodes are found
- Nodes are properly connected
- Check browser console for errors

### Issue: Node status stuck on "Running" (⏳)
**Solution:**
- This is rare but can happen with async operations
- Refresh the page and try again
- Check browser console for error messages

### Issue: Can't see connection lines
**Solution:**
- Ensure nodes are properly connected
- Try refreshing the page
- Check that the canvas is scrolled to show both nodes

### Issue: Configuration panel won't open
**Solution:**
- Only nodes with the ⚙️ button are configurable
- Check if you're clicking directly on the gear icon
- Some nodes (Trigger, Transform, Merge, Action, Output) don't have configuration options

### Issue: File Reader returns no results
**Note:** The File Reader currently simulates file reading with sample data. It will return 5 different file types regardless of the directory path configured. This is intended for demonstration purposes.

## Future Enhancements

Potential features for future versions:
- Save/Load workflows to/from JSON
- Export workflows
- Custom node types
- Real file system integration for File Reader node
- Advanced data processing with JavaScript expressions
- Multiple file type support for uploads
- Drag-to-connect functionality
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
