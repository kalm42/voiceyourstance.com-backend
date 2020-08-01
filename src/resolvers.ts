import * as mutations from "./mutations"
import * as queries from "./queries"

export default {
  Query: {
    ...queries,
  },
  Mutation: {
    ...mutations,
  },
}
