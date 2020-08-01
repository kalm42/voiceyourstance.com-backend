import { Context, TemplatesArgs, GetTemplateByIdArgs } from "../types"
import { requireLoggedInUser } from "../utilities"

// templates(where: TemplateSearchInput): [Template]!
/**
 * Find all relevant templates
 *
 * templates(where: TemplateSearchInput): PageinatedTemplates!
 */
export function templates(parent, args: TemplatesArgs, ctx: Context) {
  const { text, page } = args
  const PAGE_SIZE = 10

  const where = { where: { AND: [{ isSearchable: true }, { OR: [{ title_contains: text, tags_contains: text }] }] } }

  return {
    nodes: ctx.db.templates({
      ...where,
      orderBy: "createdAt_DESC",
      first: PAGE_SIZE,
      skip: page * PAGE_SIZE,
    }),
    meta: async () => {
      const count = await ctx.db.templatesConnection(where).aggregate().count()
      return {
        nodeCount: count,
        pageCount: Math.ceil(count / PAGE_SIZE),
        pageCurrent: (page * PAGE_SIZE) / PAGE_SIZE,
        nodesPerPage: PAGE_SIZE,
      }
    },
  }
}

export async function getTemplateById(parent, args: GetTemplateByIdArgs, ctx: Context) {
  return ctx.db.template({ id: args.id })
}

export function getUsersTemplates(parent, args, ctx: Context) {
  requireLoggedInUser(ctx)
  return ctx.db.templates({ where: { AND: [{ user: { id: ctx.userId } }] }, orderBy: "updatedAt_DESC" })
}

export function publicTemplates(parent, args, ctx: Context) {
  return ctx.db.templates({ where: { isSearchable: true }, orderBy: "useCount_DESC" })
}
