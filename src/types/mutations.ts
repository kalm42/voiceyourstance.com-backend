import { LetterInput, AddressInput, TemplateInput } from "."

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
  template: TemplateInput
}

export interface UpdateTemplateArgs {
  id: string
  template: TemplateInput
}

export interface CreateLetterArgs {
  letter: LetterInput
}

export interface UpdateLetterArgs {
  letterId: string
  from?: AddressInput
  content?: string
}

export interface MailLetterArgs {
  letterId: string
  stripeId: string
}

export interface IncrementTemplateUseArgs {
  id: string
}
