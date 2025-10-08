import { getSession } from '../../utils/db'
import type { Workspace } from '../../../app/types/workflow'

export default defineEventHandler(async (event) => {
  const session = await getSession()
  
  try {
    const result = await session.run(`
      MATCH (w:Workspace)
      RETURN w
      ORDER BY w.createdAt DESC
    `)
    
    const workspaces: Workspace[] = result.records.map(record => {
      const node = record.get('w')
      return {
        id: node.properties.id,
        name: node.properties.name,
        description: node.properties.description,
        createdAt: new Date(node.properties.createdAt),
        updatedAt: new Date(node.properties.updatedAt)
      }
    })
    
    return workspaces
  } catch (error) {
    console.error('Error fetching workspaces:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch workspaces'
    })
  } finally {
    await session.close()
  }
})
