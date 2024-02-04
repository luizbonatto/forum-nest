import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AnswerFactory } from 'test/factories/make-answer'
import { StudentFactory } from 'test/factories/make-student'

import request from 'supertest'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'

describe('Fetch answers comments (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let studentFactory: StudentFactory
  let answerCommentFactory: AnswerCommentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerFactory,
        AnswerCommentFactory,
        QuestionFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })
  test('[GET] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

    const acessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    await Promise.all([
      answerCommentFactory.makePrismaQueestionComment({
        authorId: user.id,
        content: 'Comment 01',
        answerId: answer.id,
      }),
      answerCommentFactory.makePrismaQueestionComment({
        authorId: user.id,
        content: 'Comment 02',
        answerId: answer.id,
      }),
    ])

    const answerId = answer.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/answers/${answerId}/comments`)
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
