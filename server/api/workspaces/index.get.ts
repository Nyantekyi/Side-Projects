import { useMockDb } from '../../utils/mockDb'

export default defineEventHandler(async (event) => {
  const mockDb = useMockDb()
  
  try {
    const workspaces = await mockDb.getWorkspaces()
    return workspaces
  } catch (error) {
    console.error('Error fetching workspaces:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch workspaces'
    })
  }
})
