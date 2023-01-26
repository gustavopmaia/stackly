import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

export const createUser = async (req: FastifyRequest) => {
  const createUserObject = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().length(6),
  })

  const { name, email, password } = createUserObject.parse(req.body)

  const password_hash = await argon2.hash(password)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
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
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      Questions: {
        select: {
          title: true,
          content: true,
        },
      },
    },
  })
}

const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  return user
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
  const getUserParams = z.object({
    id: z.string().uuid(),
    name: z.string().optional(),
    email: z.string().optional(),
    password: z.string().length(6).optional(),
  })

  const { password, email, name, id } = getUserParams.parse(req.body)

  const password_hash = password ? await argon2.hash(password) : password

  console.log(id)

  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      password_hash,
    },
  })
}

export const login = async (req: FastifyRequest, res: FastifyReply) => {
  const loginObjectParams = z.object({
    email: z.string(),
    password: z.string(),
  })

  const { password, email } = loginObjectParams.parse(req.body)
  const user = await getUserByEmail(email)

  if (await argon2.verify(String(user?.password_hash), password)) {
    const id = user?.id
    const oneDay = 3600
    const token = jwt.sign({ id }, String(process.env.SECRET), {
      expiresIn: oneDay,
    })

    return { token: token }
  } else {
    res.code(401)
    throw new Error('ERROR: Invalid email or password')
  }
}
