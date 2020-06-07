import express from "express"
import bodyParser from "body-parser"
import { ApolloServer } from "apollo-server-express"
import { environment } from "./environment"
import resolvers from "./resolvers"
import typeDefs from "./type-defs"

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
})

const app = express()

app.use(express.json())

server.applyMiddleware({ app })

app.listen({ port: environment.port }, () => {
  console.log(`Server ready at http://localhost:${environment.port}${server.graphqlPath}`)
})

// Hot module replacement
if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => console.log("Module disposed."))
}
