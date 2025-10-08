import { getSession } from '../../utils/db'
import type { Project } from '../../../app/types/workflow'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const workspaceId = query.workspaceId as string
  
  const session = await getSession()
  
  try {
    const result = await session.run(`
      MATCH (w:Workspace {id: $workspaceId})-[:CONTAINS]->(p:Project)
      RETURN p
      ORDER BY p.createdAt DESC
    `, { workspaceId })
    
    const projects: Project[] = result.records.map(record => {
      const node = record.get('p')
      return {
        id: node.properties.id,
        workspaceId: node.properties.workspaceId,
        name: node.properties.name,
        description: node.properties.description,
        createdAt: new Date(node.properties.createdAt),
        updatedAt: new Date(node.properties.updatedAt)
      }
    })
    
    return projects
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch projects'
    })
  } finally {
    await session.close()
  }
})
