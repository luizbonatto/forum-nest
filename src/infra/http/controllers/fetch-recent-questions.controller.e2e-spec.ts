import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

import request from 'supertest'

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })
  test('[GET] /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const acessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Question 01',
      }),
      questionFactory.makePrismaQuestion({
        authorId: user.id,
        title: 'Question 02',
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${acessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      questions: expect.arrayContaining([
        expect.objectContaining({ title: 'Question 01' }),
        expect.objectContaining({ title: 'Question 02' }),
      ]),
    })
  })
})
