import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

const questionId = '0730ffac-d039-4194-9571-01aa2aa0efbd'
const answerId = '00880d75-a933-4fef-94ab-e05744435297'
const userId = 'aa3c8320-e791-45d1-ae45-72224b7688c2'

const questionId2 = 'fa036685-149b-47c0-8b17-2f216cb572ec'
const answerId2 = '9195ae81-9678-4c53-8477-6597f7014301'
const userId2 = '1ef02fe4-8f06-47b2-af9f-f57b7669eb37'

async function main() {
  await prisma.answer.deleteMany()
  await prisma.question.deleteMany()
  await prisma.user.deleteMany()

  await Promise.all([
    prisma.user.create({
      data: {
        id: userId,
        name: 'Gustavo Maia',
        email: 'gustavo@teste.com',
        password_hash: await argon2.hash('123456'),
      },
    }),
    prisma.question.create({
      data: {
        id: questionId,
        user_id: userId,
        title: 'My question title',
        content: 'My question content',
      },
    }),
  ])

  await Promise.all([
    prisma.answer.create({
      data: {
        id: answerId,
        question_id: questionId,
        user_id: userId,
        content: 'My answer content',
      },
    }),
  ])

  await Promise.all([
    prisma.answer.create({
      data: {
        id: answerId2,
        question_id: questionId,
        user_id: userId,
        content: 'My answer content 2',
      },
    }),
  ])
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })

  .catch(async (e) => {
    console.error(e)

    await prisma.$disconnect()

    process.exit(1)
  })
