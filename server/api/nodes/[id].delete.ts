import { getSession } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const session = await getSession()
  
  try {
    await session.run(`
      MATCH (n:Node {id: $id})
      DETACH DELETE n
    `, { id })
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting node:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete node'
    })
  } finally {
    await session.close()
  }
})
