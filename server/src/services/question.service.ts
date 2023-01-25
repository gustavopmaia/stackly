import { prisma } from '../lib/prisma'

export const getQuestionsSvc = async (page: number) => {
  const PAGE_SIZE = 6

  return await prisma.question.findMany({
    skip: PAGE_SIZE * page,
    take: PAGE_SIZE,
  })
}
