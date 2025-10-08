import { getSession } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const session = await getSession()
  
  try {
    const id = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    await session.run(`
      MATCH (w:Workspace {id: $workspaceId})
      CREATE (p:Project {
        id: $id,
        workspaceId: $workspaceId,
        name: $name,
        description: $description,
        createdAt: $createdAt,
        updatedAt: $updatedAt
      })
      CREATE (w)-[:CONTAINS]->(p)
      RETURN p
    `, {
      id,
      workspaceId: body.workspaceId,
      name: body.name,
      description: body.description || '',
      createdAt: now,
      updatedAt: now
    })
    
    return {
      id,
      workspaceId: body.workspaceId,
      name: body.name,
      description: body.description,
      createdAt: now,
      updatedAt: now
    }
  } catch (error) {
    console.error('Error creating project:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create project'
    })
  } finally {
    await session.close()
  }
})
