import { Context, TemplatesArgs, GetTemplateByIdArgs } from "../types"

// templates(where: TemplateSearchInput): [Template]!
/**
 * Find all relevant templates
 *
 * templates(where: TemplateSearchInput): [Template]!
 */
export function templates(parent, args: TemplatesArgs, ctx: Context) {
  const { text } = args
  return ctx.db.templates({ where: { OR: [{ title_contains: text, tags_contains: text }, {}] } })
}

export async function getTemplateById(parent, args: GetTemplateByIdArgs, ctx: Context) {
  return ctx.db.template({ id: args.id })
}
