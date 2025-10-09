import { useMockDb } from '../../utils/mockDb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const mockDb = useMockDb()
  
  try {
    const link = await mockDb.createLink(
      body.sourceNodeId,
      body.targetNodeId,
      body.projectId,
      body.label
    )
    return link
  } catch (error) {
    console.error('Error creating link:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create link'
    })
  }
})
