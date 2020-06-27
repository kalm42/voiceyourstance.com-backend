import { gql } from "apollo-server-express"

export default gql`
  type Query {
    # new
    me: User
    templates(where: TemplateSearchInput): [Template]!
  }
  type Mutation {
    createLetter(letter: LetterInput): Letter!
    updateLetter(letterId: String!, letter: AddressInput): Letter!
    mailLetter(letterId: String!, stripeId: String!): Mail!
    # new
    signin(email: String!, password: String!): User!
    signout: SuccessMessage
    signup(email: String!, password: String!): User!
    requestRest(email: String!): SuccessMessage
    resetPassword(resetToken: String!, password: String!, confirmPassword: String!): User!
    createTemplate(template: TemplateInput!): Template!
    updateTemplate(template: TemplateInput!, id: String!): Template!
  }

  input TemplateSearchInput {
    title: String
    tags: [String]
  }

  input TemplateInput {
    title: String!
    tags: [String!]!
    content: Json!
  }

  input LetterInput {
    toName: String!
    toAddressLine1: String!
    toAddressLine2: String!
    toAddressCity: String!
    toAddressState: String!
    toAddressZip: String!
    fromName: String!
    fromAddressLine1: String!
    fromAddressLine2: String!
    fromAddressCity: String!
    fromAddressState: String!
    fromAddressZip: String!
    content: Json!
  }

  input AddressInput {
    fromName: String!
    fromAddressLine1: String!
    fromAddressCity: String!
    fromAddressState: String!
    fromAddressZip: String!
  }

  type SuccessMessage {
    message: String
  }

  type Letter {
    id: ID!
    fromAddress: Address!
    toAddress: Address!
    content: Json!
    payment: Payment
    mail: Mail
    user: User
    createdAt: String!
    updatedAt: String!
  }

  type Payment {
    id: ID!
    stripeId: String!
    letter: Letter!
    createdAt: String!
    updatedAt: String!
  }

  type Mail {
    id: ID!
    lobId: String!
    letter: Letter!
    expectedDeliveryDate: String!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    resetToken: String
    resetExpiry: Float
    letters: [Letter!]!
    templates: [Template!]!
    createdAt: String!
    updatedAt: String!
  }

  type Address {
    id: ID!
    hash: String!
    name: String!
    line1: String!
    line2: String
    city: String!
    state: String!
    zip: String!
    createdAt: String!
    updatedAt: String!
  }

  type Template {
    id: ID!
    title: String!
    tags: String!
    content: Json!
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  scalar Json
`
