export interface Letter {
  id: string
  fromAddress: Address
  toAddress: Address
  content: string
  payment?: Payment
  mail?: Mail
  user?: User
  template?: Template
  createdAt: string
  updatedAt: string
}

export interface Payment {
  id: string
  stripeId: string
  letter: Letter
  createdAt: string
  updatedAt: string
}

export interface Mail {
  id: string
  lobId: string
  letter: Letter
  expectedDeliveryDate: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  password: string
  resetToken?: string
  resetExpiry?: number
  letters?: Letter[]
  templates?: Template[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  hash: string
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  title: string
  tags: string
  content: string
  user: User
  createdAt: string
  updatedAt: string
}
