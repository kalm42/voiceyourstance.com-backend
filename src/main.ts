import { ApolloServer } from "apollo-server";
import { environment } from "./environment";
import resolvers from "./resolvers";
import typeDefs from "./type-defs";

const server = new ApolloServer({
  resolvers,
  typeDefs,
  introspection: environment.apollo.introspection,
  playground: environment.apollo.playground,
});

server.listen().then(({ url }) => console.log(`Server is ready at ${url}.`));

// Hot module replacement
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => console.log("Module disposed."));
}
