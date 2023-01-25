import { FastifyInstance } from 'fastify'
import { prisma } from './lib/prisma'
import { z } from 'zod'
import {
  createUser,
  deleteUser,
  getUserById,
  updateUser,
} from './modules/user.controller'

import {
  createQuestion,
  getQuestion,
  getQuestions,
} from './modules/question.controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', async (req) => createUser(req))

  app.get('/users/:id', async (req) => {
    return getUserById(req)
  })

  app.post('/users/:id/delete', async (req) => {
    deleteUser(req)
  })

  app.put('/users/:id', async (req) => {
    updateUser(req)
  })

  app.post('/questions', async (req) => createQuestion(req))
  app.get('/questions', async (req) => getQuestions(req))
  app.get('/questions/:id', async (req) => getQuestion(req))

  app.post('/answers', async (req) => {
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
  })
}
