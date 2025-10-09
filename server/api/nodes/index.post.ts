import { useMockDb } from '../../utils/mockDb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const mockDb = useMockDb()
  
  try {
    const node = await mockDb.createNode(body)
    return node
  } catch (error) {
    console.error('Error creating node:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create node'
    })
  }
})
