import { useMockDb } from '../../utils/mockDb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const mockDb = useMockDb()
  
  try {
    const project = await mockDb.createProject(body.workspaceId, body.name, body.description)
    return project
  } catch (error) {
    console.error('Error creating project:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create project'
    })
  }
})
