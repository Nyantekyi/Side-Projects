import { getSession } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const session = await getSession()
  
  try {
    const id = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const query = `
      MATCH (p:Project {id: $projectId})
      CREATE (n:Node {
        id: $id,
        projectId: $projectId,
        positionX: $positionX,
        positionY: $positionY,
        label: $label,
        type: $type,
        config: $config,
        linkedProjectId: $linkedProjectId
      })
      CREATE (p)-[:CONTAINS]->(n)
      RETURN n
    `
    
    await session.run(query, {
      id,
      projectId: body.projectId,
      positionX: body.position.x,
      positionY: body.position.y,
      label: body.data.label,
      type: body.data.type,
      config: body.data.config ? JSON.stringify(body.data.config) : null,
      linkedProjectId: body.linkedProjectId || null
    })
    
    return {
      id,
      projectId: body.projectId,
      position: body.position,
      data: body.data,
      linkedProjectId: body.linkedProjectId
    }
  } catch (error) {
    console.error('Error creating node:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create node'
    })
  } finally {
    await session.close()
  }
})
