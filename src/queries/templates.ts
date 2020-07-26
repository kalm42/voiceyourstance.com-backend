import { Context, TemplatesArgs, GetTemplateByIdArgs } from "../types"
import { requireLoggedInUser } from "../utilities"

// templates(where: TemplateSearchInput): [Template]!
/**
 * Find all relevant templates
 *
 * templates(where: TemplateSearchInput): [Template]!
 */
export function templates(parent, args: TemplatesArgs, ctx: Context) {
  const { text } = args
  return ctx.db.templates({
    where: { AND: [{ isSearchable: true }, { OR: [{ title_contains: text, tags_contains: text }] }] },
  })
}

export async function getTemplateById(parent, args: GetTemplateByIdArgs, ctx: Context) {
  return ctx.db.template({ id: args.id })
}

export function getUsersTemplates(paranet, args, ctx: Context) {
  requireLoggedInUser(ctx)
  return ctx.db.templates({ where: { AND: [{ user: { id: ctx.userId } }] }, orderBy: "updatedAt_DESC" })
}
