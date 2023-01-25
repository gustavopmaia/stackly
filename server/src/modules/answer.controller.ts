import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

import { getAnswersSvc } from '../services/answer.service'

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

export const getAnswers = async (req: FastifyRequest, res: FastifyReply) => {
  const { page }: any = req.query

  if (isNaN(page)) {
    res.status(400)
    throw new Error('ERROR: The specified page number is invalid')
  } else {
    return getAnswersSvc(parseInt(page))
  }
}

export const getAnswer = async (req: FastifyRequest) => {
  const getAnswerParam = z.object({
    id: z.string().uuid(),
  })

  const { id } = getAnswerParam.parse(req.params)

  return await prisma.answer.findUnique({
    where: {
      id,
    },
  })
}

export const updateAnswer = async (req: FastifyRequest) => {
  const updateAnswerParam = z.object({
    id: z.string().uuid(),
    content: z.string().optional(),
  })

  const { id, content } = updateAnswerParam.parse(req.body)

  return await prisma.answer.update({
    where: {
      id,
    },
    data: {
      id,
      content,
    },
  })
}

export const deleteAnswer = async (req: FastifyRequest) => {
  const deleteAnswerParam = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteAnswerParam.parse(req.params)

  await prisma.answer.delete({
    where: {
      id,
    },
  })
}
