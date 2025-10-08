import { getSession } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const session = await getSession()
  
  try {
    const id = `workspace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    await session.run(`
      CREATE (w:Workspace {
        id: $id,
        name: $name,
        description: $description,
        createdAt: $createdAt,
        updatedAt: $updatedAt
      })
      RETURN w
    `, {
      id,
      name: body.name,
      description: body.description || '',
      createdAt: now,
      updatedAt: now
    })
    
    return {
      id,
      name: body.name,
      description: body.description,
      createdAt: now,
      updatedAt: now
    }
  } catch (error) {
    console.error('Error creating workspace:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create workspace'
    })
  } finally {
    await session.close()
  }
})
