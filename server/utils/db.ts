import neo4j, { Driver, Session } from 'neo4j-driver'

let driver: Driver | null = null

export function getNeo4jDriver(): Driver {
  if (!driver) {
    const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687'
    const user = process.env.NEO4J_USER || 'neo4j'
    const password = process.env.NEO4J_PASSWORD || 'password'
    
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
  }
  return driver
}

export async function getSession(): Promise<Session> {
  const driver = getNeo4jDriver()
  return driver.session()
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close()
    driver = null
  }
}

// Initialize database schema
export async function initializeDatabase() {
  const session = await getSession()
  
  try {
    // Create constraints and indexes
    await session.run(`
      CREATE CONSTRAINT workspace_id IF NOT EXISTS
      FOR (w:Workspace) REQUIRE w.id IS UNIQUE
    `)
    
    await session.run(`
      CREATE CONSTRAINT project_id IF NOT EXISTS
      FOR (p:Project) REQUIRE p.id IS UNIQUE
    `)
    
    await session.run(`
      CREATE CONSTRAINT node_id IF NOT EXISTS
      FOR (n:Node) REQUIRE n.id IS UNIQUE
    `)
    
    await session.run(`
      CREATE CONSTRAINT link_id IF NOT EXISTS
      FOR (l:Link) REQUIRE l.id IS UNIQUE
    `)
    
    console.log('Database schema initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
  } finally {
    await session.close()
  }
}
