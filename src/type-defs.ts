import { gql } from "apollo-server-express"

export default gql`
  type Query {
    """
    Test Message.
    """
    testMessage: String!
  }
  type Mutation {
    createLetter(letter: LetterInput): Letter!
    updateLetter(letterId: String!, letter: AddressInput): Letter!
    mailLetter(letterId: String!, stripeId: String!): Mail!
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
  type Letter {
    id: ID!
    fromName: String!
    fromLine1: String!
    fromCity: String!
    fromState: String!
    fromZip: String!
    toName: String!
    toLine1: String!
    toCity: String!
    toState: String!
    toZip: String!
    content: Json!
    payment: Payment
    mail: Mail
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

  scalar Json
`
