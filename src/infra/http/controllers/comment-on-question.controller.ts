import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { z } from 'zod'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

const createCommentOnQuestionBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  createCommentOnQuestionBodySchema,
)

type CreateCommentOnQuestionBodySchema = z.infer<
  typeof createCommentOnQuestionBodySchema
>

@Controller('/questions/:questionId/comments')
export class CreateCommentOnQuestionController {
  constructor(private createCommentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateCommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body
    const { sub: userId } = user

    const result = await this.createCommentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
