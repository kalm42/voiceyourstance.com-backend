import { Context, GetAddressByIdArgs } from "../types"

export function getAddressById(parent, args: GetAddressByIdArgs, ctx: Context) {
  return ctx.db.address({ id: args.id })
}
