import { FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export const createAnswer = async (req: FastifyRequest) => {
  const answerCreateObject = z.object({
    content: z.string(),
    user_id: z.string().uuid(),
    question_id: z.string().uuid(),
  })

  const { content, user_id, question_id } = answerCreateObject.parse(req.body)

  await prisma.answer.create({
    data: {
      content,
      user_id,
      question_id,
    },
  })
}
