import { FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

import { getQuestionsSvc } from '../services/question.service'

export const createQuestion = async (req: FastifyRequest) => {
  const createQuestionObject = z.object({
    title: z.string(),
    content: z.string(),
    user_id: z.string().uuid(),
  })

  const { title, content, user_id } = createQuestionObject.parse(req.body)

  return await prisma.question.create({
    data: {
      title,
      content,
      user_id,
    },
  })
}

export const getQuestions = async (req: FastifyRequest) => {
  const { page }: any = req.query

  return getQuestionsSvc(parseInt(page))
}

export const getQuestion = async (req: FastifyRequest) => {
  const getQuestionObject = z.object({
    id: z.string().uuid(),
  })

  const { id } = getQuestionObject.parse(req.params)

  return await prisma.question.findUnique({
    where: {
      id,
    },
  })
}
