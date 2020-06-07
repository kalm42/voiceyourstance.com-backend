import { gql } from "apollo-server";

export default gql`
  type Query {
    """
    Test Message.
    """
    testMessage: String!
  }
  type Mutation {
    createIntentionToPay: String!
  }
`;
