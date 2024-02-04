import { Question } from '@/domain/forum/enterpise/entities/question'

export class QuestionPreseter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      title: question.title,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId
        ? question.bestAnswerId.toString()
        : null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
