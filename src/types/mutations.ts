import { LetterInput, AddressInput } from "."

export interface SignUpArgs {
  email: string
  password: string
}

export interface RequestResetArgs {
  email: string
}

export interface ResetPasswordArgs {
  resetToken: string
  password: string
  confirmPassword: string
}

export interface SigninArgs {
  email: string
  password: string
}

export interface CreateTemplateArgs {
  title: string
  tags: string[]
  content: string
}

export interface UpdateTemplateArgs {
  id: string
  title: string
  tags: string[]
  content: string
}

export interface CreateLetterArgs {
  letter: LetterInput
}

export interface UpdateLetterArgs {
  letterId: string
  from: AddressInput
}

export interface MailLetterArgs {
  letterId: string
  stripeId: string
}
