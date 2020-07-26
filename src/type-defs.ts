import { gql } from "apollo-server-express"

export default gql`
  type Query {
    me: User
    templates(text: String!, page: Int!): PaginatedTemplates!
    getTemplateById(id: String!): Template!
    getUsersTemplates: [Template!]!
    getLetterById(id: String!): Letter!
    getDraftLetters: [Letter!]!
    getSentLetters: [Letter!]!
    getAddressById(id: String!): Address!
  }

  type Mutation {
    createLetter(letter: LetterInput): Letter!
    updateLetter(letterId: String!, from: AddressInput, content: Json): Letter!
    mailLetter(letterId: String!, stripeId: String!): Mail!
    signin(email: String!, password: String!): User!
    signout: SuccessMessage
    signup(email: String!, password: String!): User!
    requestReset(email: String!): SuccessMessage
    resetPassword(resetToken: String!, password: String!, confirmPassword: String!): User!
    createTemplate(template: TemplateInput!): Template!
    updateTemplate(template: TemplateInput!, id: String!): Template!
  }

  # Inputs
  input TemplateInput {
    title: String!
    tags: [String!]!
    content: Json!
    isSearchable: Boolean!
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

  # Models
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
    letters: [Letter!]!
    templates: [Template!]!
    address: Address
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
    isSearchable: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type PaginatedTemplates {
    nodes: [Template!]!
    meta: PaginatedTemplatesMeta!
  }

  type PaginatedTemplatesMeta {
    nodeCount: Int!
    pageCount: Int!
    pageCurrent: Int!
    nodesPerPage: Int!
  }

  scalar Json
`
