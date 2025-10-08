import { useMockDb } from '../../utils/mockDb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const projectId = query.projectId as string
  const mockDb = useMockDb()
  
  try {
    const nodes = await mockDb.getNodes(projectId)
    return nodes
  } catch (error) {
    console.error('Error fetching nodes:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch nodes'
    })
  }
})
