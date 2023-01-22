import { FastifyInstance } from 'fastify'
import { prisma } from './lib/prisma'

export async function appRoutes(app: FastifyInstance) {
  app.get('/', async (req, res) => {
    const users = await prisma.user.findMany()

    return users
  })
}
