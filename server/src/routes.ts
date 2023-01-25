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
  deleteQuestion,
  getQuestion,
  getQuestions,
  updateQuestion,
} from './modules/question.controller'
import { createAnswer } from './modules/answer.controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', async (req) => createUser(req)) // Create User Route
  app.get('/users/:id', async (req) => getUserById(req)) // Get user by ID route
  app.delete('/users/:id/delete', async (req) => deleteUser(req)) // Delete user
  app.put('/users', async (req) => updateUser(req)) // Update User

  app.post('/questions', async (req) => createQuestion(req)) // Create question
  app.get('/questions', async (req) => getQuestions(req)) // Get question and paginate by /?page=0
  app.get('/questions/:id', async (req) => getQuestion(req)) // Get question by id
  app.patch('/questions', async (req) => updateQuestion(req)) // Update question
  app.delete('/questions/:id', async (req) => deleteQuestion(req))

  app.post('/answers', async (req) => createAnswer(req))
}
