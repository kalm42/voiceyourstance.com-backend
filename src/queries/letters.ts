import { Context, GetLetterByIdArgs } from "../types"
import { requireLoggedInUser } from "../utilities"

const withAddress = `
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
const withAddressAndMail = `
  fragment LetterWithAddressAndMail on Letter {
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
    mail {
      id
      expectedDeliveryDate
      createdAt
    }
  }
`

/**
 * Returns a user's unsent letters
 */
export function getDraftLetters(parent, args, ctx: Context) {
  requireLoggedInUser(ctx)
  return ctx.db
    .letters({ where: { AND: [{ user: { id: ctx.userId } }, { mail: null }] }, orderBy: "updatedAt_DESC" })
    .$fragment(withAddress)
}

export async function getLetterById(parent, args: GetLetterByIdArgs, ctx: Context) {
  requireLoggedInUser(ctx)
  const letterOwner = await ctx.db.letter({ id: args.id }).user()
  if (letterOwner.id !== ctx.userId) {
    // current user is not owner
    throw new Error("Not authorized")
  }
  return ctx.db.letter({ id: args.id }).$fragment(withAddress)
}

export function getSentLetters(parent, args, ctx: Context) {
  requireLoggedInUser(ctx)
  return ctx.db
    .letters({
      where: { AND: [{ user: { id: ctx.userId } }, { mail: { id_not: null } }] },
      orderBy: "updatedAt_DESC",
    })
    .$fragment(withAddressAndMail)
}
