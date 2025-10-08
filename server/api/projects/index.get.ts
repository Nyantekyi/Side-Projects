import { useMockDb } from '../../utils/mockDb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const workspaceId = query.workspaceId as string
  const mockDb = useMockDb()
  
  try {
    const projects = await mockDb.getProjects(workspaceId)
    return projects
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch projects'
    })
  }
})
