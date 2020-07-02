import express from "express"
import { ApolloServer } from "apollo-server-express"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import { environment } from "./environment"
import resolvers from "./resolvers"
import typeDefs from "./type-defs"
import cors from "cors"
import { prisma } from "./prisma/generated/prisma-client"
import { EnhancedRequest, JWTToken } from "./types"
import stripe from "./apis/stripe"

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
  context: ({ req, res }) => ({
    ...req,
    res,
    db: prisma,
  }),
})

const app = express()

// Setup CORS for the frontend since it'll be a different subdomain
const FRONTEND = process.env.FRONTEND
console.log("Frontend Origin: ", FRONTEND)

app.use(cors({ origin: FRONTEND, credentials: true }))

// Parse cookies for the jwt
app.use(cookieParser())

// Check for a jwt, if there is one, validate it and attach the userid to the request object
app.use((req: EnhancedRequest, res, next) => {
  const { token } = req.cookies
  if (token) {
    const decodedToken = jwt.verify(token, process.env.APP_SECRET)
    const { userId } = (decodedToken as unknown) as JWTToken
    req.userId = userId
  }
  next()
})

// If there's a userId on the request object, attach the full user
app.use(async (req: EnhancedRequest, res, next) => {
  // If the user id is not set then move on
  if (!req.userId) {
    return next()
  }

  // else find the user and attach the full user to the request object
  try {
    const user = await prisma.user({ id: req.userId })
    req.user = user
    next()
  } catch (error) {
    req.userId = undefined // user isn't in the database and so the user id is invalid
    console.log(error)
    next()
  }
})

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
