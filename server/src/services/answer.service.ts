import { prisma } from '../lib/prisma'
import { FastifyRequest } from 'fastify'

export const getAnswersSvc = async (page: number) => {
  const PAGE_SIZE = 10

  return await prisma.answer.findMany({
    skip: PAGE_SIZE * page,
    take: PAGE_SIZE,
  })
}
