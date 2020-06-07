import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIP_KEY, {
  apiVersion: "2020-03-02",
})

export default {
  Query: {
    testMessage: (): string => "Hello World!",
  },
  Mutation: {
    createIntentionToPay: async () => {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 500,
        currency: "usd",
        metadata: { integration_check: "accept_a_payment" },
      })
      return paymentIntent.client_secret
    },
  },
}
