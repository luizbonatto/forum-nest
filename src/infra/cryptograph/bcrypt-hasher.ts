import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { compare, hash } from 'bcryptjs'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  async hash(plain: string): Promise<string> {
    const hashedPassword = await hash(plain, this.HASH_SALT_LENGTH)

    return hashedPassword
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash)
  }
}
