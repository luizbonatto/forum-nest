import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerAttachmentMapper } from '../../mappers/prisma-answer-attachments-mapper'
import { AnswerAttachment } from '@/domain/forum/enterpise/entities/answer-attachment'

@Injectable()
export class PrismaAnswerAttachments implements AnswerAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: { answerId },
    })

    return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async deleteManyByAnswerId(answerId: string) {
    await this.prisma.attachment.deleteMany({
      where: { answerId },
    })
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map((attachment) => {
      return attachment.id.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: { id: { in: attachmentIds } },
    })
  }
}
