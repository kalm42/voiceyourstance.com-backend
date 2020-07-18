import { Context } from "../types"
import { requireLoggedInUser } from "../utilities"

/**
 * Returns a user's unsent letters
 */
export function getDraftLetters(parent, args, ctx: Context) {
  requireLoggedInUser(ctx)
  const fragment = `
    fragment LetterWithAddresses on Letter {
      id
      updatedAt
      content
      toAddress {
        id
        hash
        name
        line1
        line2
        city
        state
        zip
      }
    }
  `
  return ctx.db
    .letters({ where: { AND: [{ user: { id: ctx.userId } }, { mail: null }] }, orderBy: "updatedAt_DESC" })
    .$fragment(fragment)
}
