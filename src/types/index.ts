import { Prisma } from "../prisma/generated/prisma-client"
import { Request } from "express"
import { User } from "./db"
export * from "./lob"
export * from "./db"
export * from "./mutations"
export * from "./queries"

export interface Context extends EnhancedRequest {
  db: Prisma
}

export interface LetterInput {
  toName: string
  toAddressLine1: string
  toAddressLine2: string
  toAddressCity: string
  toAddressState: string
  toAddressZip: string
  fromName: string
  fromAddressLine1: string
  fromAddressLine2: string
  fromAddressCity: string
  fromAddressState: string
  fromAddressZip: string
  content: string
  templateId?: string
}

export interface AddressInput {
  fromName: string
  fromAddressLine1: string
  fromAddressCity: string
  fromAddressState: string
  fromAddressZip: string
}

export interface JWTToken {
  userId: string
}

export interface EnhancedRequest extends Request {
  userId?: string
  user?: User
}
