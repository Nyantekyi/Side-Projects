import { useMockDb } from '../../utils/mockDb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const projectId = query.projectId as string
  const mockDb = useMockDb()
  
  try {
    const links = await mockDb.getLinks(projectId)
    return links
  } catch (error) {
    console.error('Error fetching links:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch links'
    })
  }
})
