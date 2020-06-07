import stripe from "stripe";

export default {
  Query: {
    testMessage: (): string => "Hello World!",
  },
  Mutation: {
    createIntentionToPay: (): string => {},
  },
};
