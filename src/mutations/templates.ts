import { Context } from "../types"
import { isLoggedInUser } from "../utilities"

// createTemplate(template: TemplateInput!): Template!
export function createTemplate(parent, args, context: Context) {
  if (!isLoggedInUser(context)) {
    throw new Error("You must be logged in to perform this action.")
  }

  // They're authorized to make a template.
  // TODO: after the datamodel is updated, pass it through to make the template
}

// updateTemplate(template: TemplateInput!, id: String!): Template!
export function updateTemplate(parent, args, context: Context) {
  if (!isLoggedInUser(context)) {
    throw new Error("You must be logged in to perform this action.")
  }
  // TODO: all below, after the datamodel is updated
  // find the template
  // get the userid for the associated user
  // confirm that the logged in user is the user who created the template
  // if not then throw an error
  // else update the template
}
