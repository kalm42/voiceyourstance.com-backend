import { Context } from "../types"
import { requireLoggedInUser } from "../utilities"

export function me(parent, args, ctx: Context) {
  requireLoggedInUser(ctx)
  return ctx.db.user({ id: ctx.userId })
}
