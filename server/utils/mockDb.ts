// Mock database for development when Neo4j is not available
import type { Workspace, Project, WorkflowNode, Link } from '../../app/types/workflow'

// In-memory storage
const mockWorkspaces: Workspace[] = []
const mockProjects: Project[] = []
const mockNodes: WorkflowNode[] = []
const mockLinks: Link[] = []

export const useMockDb = () => {
  return {
    // Workspace operations
    async getWorkspaces(): Promise<Workspace[]> {
      return mockWorkspaces
    },
    
    async createWorkspace(name: string, description?: string): Promise<Workspace> {
      const workspace: Workspace = {
        id: `workspace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        description: description || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockWorkspaces.push(workspace)
      return workspace
    },
    
    // Project operations
    async getProjects(workspaceId: string): Promise<Project[]> {
      return mockProjects.filter(p => p.workspaceId === workspaceId)
    },
    
    async createProject(workspaceId: string, name: string, description?: string): Promise<Project> {
      const project: Project = {
        id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        workspaceId,
        name,
        description: description || '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockProjects.push(project)
      return project
    },
    
    // Node operations
    async getNodes(projectId: string): Promise<WorkflowNode[]> {
      return mockNodes.filter(n => n.projectId === projectId)
    },
    
    async createNode(node: WorkflowNode): Promise<WorkflowNode> {
      mockNodes.push(node)
      return node
    },
    
    async deleteNode(nodeId: string): Promise<void> {
      const index = mockNodes.findIndex(n => n.id === nodeId)
      if (index !== -1) {
        mockNodes.splice(index, 1)
      }
      // Also delete associated links
      const linkIndices: number[] = []
      mockLinks.forEach((link, i) => {
        if (link.sourceNodeId === nodeId || link.targetNodeId === nodeId) {
          linkIndices.push(i)
        }
      })
      linkIndices.reverse().forEach(i => mockLinks.splice(i, 1))
    },
    
    // Link operations
    async getLinks(projectId: string): Promise<Link[]> {
      return mockLinks.filter(l => l.projectId === projectId)
    },
    
    async createLink(sourceNodeId: string, targetNodeId: string, projectId: string, label?: string): Promise<Link> {
      const link: Link = {
        id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceNodeId,
        targetNodeId,
        projectId,
        label: label || '',
        createdAt: new Date()
      }
      mockLinks.push(link)
      return link
    },
    
    async deleteLink(linkId: string): Promise<void> {
      const index = mockLinks.findIndex(l => l.id === linkId)
      if (index !== -1) {
        mockLinks.splice(index, 1)
      }
    }
  }
}
