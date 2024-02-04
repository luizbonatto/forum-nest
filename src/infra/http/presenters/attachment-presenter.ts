import { Attachment } from '@/domain/forum/enterpise/entities/attachment'

export class AttachmentPresenter {
  static toHttp(attachment: Attachment) {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      url: attachment.url,
    }
  }
}
