import { Either, left, right } from '@/core/either'
import { Question } from '../../enterpise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResouceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface ChooseQuestionBestAnswerRequest {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerResponse = Either<
  ResouceNotFoundError | NotAllowedError,
  { question: Question }
>

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsQuepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerRequest): Promise<ChooseQuestionBestAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResouceNotFoundError())
    }

    const question = await this.questionsQuepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResouceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionsQuepository.save(question)

    return right({ question })
  }
}
