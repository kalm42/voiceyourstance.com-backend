import { Context } from "../types"

export function me(parent, args, context: Context) {
  return context.db.user({ where: { id: context.userId } })
}
