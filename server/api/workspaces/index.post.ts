import { useMockDb } from '../../utils/mockDb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const mockDb = useMockDb()
  
  try {
    const workspace = await mockDb.createWorkspace(body.name, body.description)
    return workspace
  } catch (error) {
    console.error('Error creating workspace:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create workspace'
    })
  }
})
