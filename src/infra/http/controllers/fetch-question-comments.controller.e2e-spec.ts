import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import request from 'supertest'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'

describe('Fetch questions comments (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let studentFactory: StudentFactory
  let questionCommentFactory: QuestionCommentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })
  test('[GET] /questions/:questionId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })

    const acessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    await Promise.all([
      questionCommentFactory.makePrismaQueestionComment({
        authorId: user.id,
        content: 'Comment 01',
        questionId: question.id,
      }),
      questionCommentFactory.makePrismaQueestionComment({
        authorId: user.id,
        content: 'Comment 02',
        questionId: question.id,
      }),
    ])

    const questionId = question.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/comments`)
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          content: 'Comment 01',
          authorName: 'John Doe',
        }),
        expect.objectContaining({
          content: 'Comment 02',
          authorName: 'John Doe',
        }),
      ]),
    })
  })
})
