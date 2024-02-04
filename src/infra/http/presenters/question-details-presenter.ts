import { QuestionDetails } from '@/domain/forum/enterpise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPreseter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      questionId: questionDetails.questionId.toString(),
      authorId: questionDetails.authorId.toString(),
      author: questionDetails.author,
      title: questionDetails.title,
      slug: questionDetails.slug.value,
      content: questionDetails.content,
      bestAnswerId: questionDetails.bestAnswerId
        ? questionDetails.bestAnswerId.toString()
        : null,
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHttp),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    }
  }
}
