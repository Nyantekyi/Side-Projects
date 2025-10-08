import { getSession } from '../../utils/db'
import type { Link } from '../../../app/types/workflow'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const projectId = query.projectId as string
  
  const session = await getSession()
  
  try {
    const result = await session.run(`
      MATCH (p:Project {id: $projectId})-[:CONTAINS]->(source:Node)-[l:LINKS_TO]->(target:Node)
      RETURN l, source.id as sourceId, target.id as targetId
    `, { projectId })
    
    const links: Link[] = result.records.map(record => {
      const link = record.get('l')
      return {
        id: link.properties.id,
        sourceNodeId: record.get('sourceId'),
        targetNodeId: record.get('targetId'),
        projectId: link.properties.projectId,
        label: link.properties.label,
        createdAt: new Date(link.properties.createdAt)
      }
    })
    
    return links
  } catch (error) {
    console.error('Error fetching links:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch links'
    })
  } finally {
    await session.close()
  }
})
