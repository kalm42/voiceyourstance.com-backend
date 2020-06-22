import { Context } from "../types"

interface TemplatesArgs {
  title?: string
  tags?: string[]
}
// templates(where: TemplateSearchInput): [Template]!
export function templates(parent, args: TemplatesArgs, context: Context) {
  return context.db.templates({ where: { ...args } })
}
