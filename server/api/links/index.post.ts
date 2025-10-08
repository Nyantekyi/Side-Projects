import { getSession } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const session = await getSession()
  
  try {
    const id = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    await session.run(`
      MATCH (source:Node {id: $sourceNodeId})
      MATCH (target:Node {id: $targetNodeId})
      CREATE (source)-[l:LINKS_TO {
        id: $id,
        projectId: $projectId,
        label: $label,
        createdAt: $createdAt
      }]->(target)
      RETURN l
    `, {
      id,
      sourceNodeId: body.sourceNodeId,
      targetNodeId: body.targetNodeId,
      projectId: body.projectId,
      label: body.label || '',
      createdAt: now
    })
    
    return {
      id,
      sourceNodeId: body.sourceNodeId,
      targetNodeId: body.targetNodeId,
      projectId: body.projectId,
      label: body.label,
      createdAt: now
    }
  } catch (error) {
    console.error('Error creating link:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create link'
    })
  } finally {
    await session.close()
  }
})
