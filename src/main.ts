import express from "express"
import bodyParser from "body-parser"
import { ApolloServer } from "apollo-server-express"
import Stripe from "stripe"
import { environment } from "./environment"
import resolvers from "./resolvers"
import typeDefs from "./type-defs"
import cors from "cors"
import { prisma } from "./prisma/generated/prisma-client"

const FRONTEND = process.env.FRONTEND
const key = process.env.STRIPE_KEY
const stripe = new Stripe(key, {
  apiVersion: "2020-03-02",
})

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
  context: ({ req }) => ({
    db: prisma,
  }),
})

const app = express()

app.use(cors({ origin: FRONTEND }))

app.use(express.json())

server.applyMiddleware({ app })

app.get("/secret", async (req, res) => {
  const intent = await stripe.paymentIntents.create({
    amount: 500,
    currency: "usd",
    metadata: { integration_check: "accept_a_payment" },
  })

  res.json({ client_secret: intent.client_secret })
})

app.listen({ port: environment.port }, () => {
  console.log(`Server ready at http://localhost:${environment.port}${server.graphqlPath}`)
})

// Hot module replacement
if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => console.log("Module disposed."))
}
