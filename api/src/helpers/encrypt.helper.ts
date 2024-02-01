import * as bcrypt from 'bcrypt'

// Função para encriptar senha:
export async function encrypt(str: string) {
  const SALT_ROUNDS = 10
  return await bcrypt.hash(str, SALT_ROUNDS)
}
