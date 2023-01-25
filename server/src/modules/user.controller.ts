import { FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export const createUser = async (req: FastifyRequest) => {
  const createUserObject = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().length(6),
  })

  const { name, email, password } = createUserObject.parse(req.body)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  })
}

export const getUserById = async (req: FastifyRequest) => {
  const getUserParams = z.object({
    id: z.string().uuid(),
  })

  const { id } = getUserParams.parse(req.params)

  return await prisma.user.findUnique({
    where: {
      id,
    },
  })
}

export const deleteUser = async (req: FastifyRequest) => {
  const getUserParams = z.object({
    id: z.string().uuid(),
  })

  const { id } = getUserParams.parse(req.params)

  await prisma.user.delete({
    where: {
      id: id,
    },
  })
}

export const updateUser = async (req: FastifyRequest) => {
  const getUserObject = z.object({
    id: z.string().uuid(),
    name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
  })

  const { id } = getUserObject.parse(req.params)
  const { name, email, password } = getUserObject.parse(req.body)

  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      password_hash: password,
    },
  })
}
