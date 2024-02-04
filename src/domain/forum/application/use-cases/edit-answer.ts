import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterpise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResouceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachmentList } from '../../enterpise/entities/answer-attachment-list'
import { AnswerAttachment } from '../../enterpise/entities/answer-attachment'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResouceNotFoundError | NotAllowedError,
  { answer: Answer }
>

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResouceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const questionAttachmentList = new AnswerAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      })
    })

    questionAttachmentList.update(questionAttachments)

    answer.attachments = questionAttachmentList
    answer.content = content

    await this.answerRepository.save(answer)

    return right({ answer })
  }
}
