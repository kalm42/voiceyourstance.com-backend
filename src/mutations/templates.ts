import { Context, CreateTemplateArgs, UpdateTemplateArgs } from "../types"
import { requireLoggedInUser, filterValidTags } from "../utilities"

// createTemplate(template: TemplateInput!): Template!

/**
 * Save a new template to the registry
 */
export function createTemplate(parent, args: CreateTemplateArgs, ctx: Context) {
  requireLoggedInUser(ctx)

  const {
    template: { content, tags, title },
  } = args

  // validate tags are formated properly ex: "#text #text2"
  const filteredTags = filterValidTags(tags)

  if (!filteredTags.length) {
    throw new Error("No valid tags were provided.")
  }
  const joinedTags = filteredTags.join(" ")

  return ctx.db.createTemplate({ content, title, tags: joinedTags, user: { connect: { id: ctx.user.id } } })
}

// updateTemplate(template: TemplateInput!, id: String!): Template!
export async function updateTemplate(parent, args: UpdateTemplateArgs, ctx: Context) {
  requireLoggedInUser(ctx)

  // Extract args
  const { template, id } = args

  console.log({ id })

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
