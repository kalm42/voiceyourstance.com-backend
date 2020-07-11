import { Context, TemplatesArgs } from "../types"

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
