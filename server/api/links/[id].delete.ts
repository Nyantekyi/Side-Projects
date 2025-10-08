import { useMockDb } from '../../utils/mockDb'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const mockDb = useMockDb()
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Link ID is required'
    })
  }
  
  try {
    await mockDb.deleteLink(id)
    return { success: true }
  } catch (error) {
    console.error('Error deleting link:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete link'
    })
  }
})
