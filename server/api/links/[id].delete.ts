import { getSession } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const session = await getSession()
  
  try {
    await session.run(`
      MATCH ()-[l:LINKS_TO {id: $id}]->()
      DELETE l
    `, { id })
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting link:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete link'
    })
  } finally {
    await session.close()
  }
})
