import { prisma } from '~/server/utils/db'

export default defineEventHandler(async () => {
  const startTime = Date.now()
  let dbStatus = 'HEALTHY'
  let dbLatencyMs = 0

  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    dbLatencyMs = Date.now() - dbStart
  } catch (error) {
    dbStatus = 'UNHEALTHY'
  }

  const isHealthy = dbStatus === 'HEALTHY'

  return {
    status: isHealthy ? 'OK' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    checks: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs
      }
    }
  }
})
