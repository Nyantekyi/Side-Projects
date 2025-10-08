import { getSession } from '../../utils/db'
import type { WorkflowNode } from '../../../app/types/workflow'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const projectId = query.projectId as string
  
  const session = await getSession()
  
  try {
    const result = await session.run(`
      MATCH (p:Project {id: $projectId})-[:CONTAINS]->(n:Node)
      RETURN n
    `, { projectId })
    
    const nodes: WorkflowNode[] = result.records.map(record => {
      const node = record.get('n')
      return {
        id: node.properties.id,
        projectId: node.properties.projectId,
        position: {
          x: node.properties.positionX,
          y: node.properties.positionY
        },
        data: {
          label: node.properties.label,
          type: node.properties.type,
          config: node.properties.config ? JSON.parse(node.properties.config) : undefined
        },
        linkedProjectId: node.properties.linkedProjectId
      }
    })
    
    return nodes
  } catch (error) {
    console.error('Error fetching nodes:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch nodes'
    })
  } finally {
    await session.close()
  }
})
