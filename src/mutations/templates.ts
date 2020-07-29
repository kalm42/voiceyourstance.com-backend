import { Context, CreateTemplateArgs, UpdateTemplateArgs, IncrementTemplateUseArgs } from "../types"
import { requireLoggedInUser, filterValidTags } from "../utilities"

// createTemplate(template: TemplateInput!): Template!

/**
 * Save a new template to the registry
 */
export function createTemplate(parent, args: CreateTemplateArgs, ctx: Context) {
  const {
    template: { content, tags, title, isSearchable },
  } = args

  // validate tags are formated properly ex: "#text #text2"
  const filteredTags = filterValidTags(tags)

  if (!filteredTags.length) {
    throw new Error("No valid tags were provided.")
  }
  const joinedTags = filteredTags.join(" ")

  return ctx.db.createTemplate({
    isSearchable,
    content,
    title,
    tags: joinedTags,
    user: ctx.userId ? { connect: { id: ctx.userId } } : null,
  })
}

// updateTemplate(template: TemplateInput!, id: String!): Template!
export async function updateTemplate(parent, args: UpdateTemplateArgs, ctx: Context) {
  requireLoggedInUser(ctx)

  // Extract args
  const { template, id } = args

  // Validate current logged in user is template owner
  const templateOwnerId = await ctx.db.template({ id }).user().id()
  if (templateOwnerId !== ctx.userId) {
    throw new Error("You cannot edit someone else's template")
  }

  // validate tags are formated properly ex: "#text #text2"
  const filteredTags = filterValidTags(template.tags)
  if (!filteredTags.length) {
    throw new Error("No valid tags were provided.")
  }
  const joinedTags = filteredTags.join(" ")

  return ctx.db.updateTemplate({ where: { id }, data: { ...template, tags: joinedTags } })
}

export async function incrementTemplateUse(parent, args: IncrementTemplateUseArgs, ctx: Context) {
  const { id } = args
  const count = await ctx.db.template({ id }).useCount()
  return ctx.db.updateTemplate({ where: { id }, data: { useCount: count + 1 } })
}
