import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Context } from "../types"

interface SigninArgs {
  email: string
  password: string
}
// signin(email: String!, password: String!): User!
export async function signin(parent, args: SigninArgs, ctx: Context) {
  // find the user by the email address provided
  // if no user is found throw a generic error
  const user = await ctx.db.user({ where: { email: args.email } })
  if (!user) {
    throw new Error(`No such user found for email ${args.email}.`)
  }
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error("Invalid password")
  }
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
  ctx.response.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  })
  return user
}

// signout: SuccessMessage
export function signout(parent, args, ctx: Context) {
  ctx.response.clearCookie("token")
  return { message: "Goodbye" }
}

//signup(email: String!, password: String!): User!
export function signup(parent, args, context: Context) {
  // check that user isn't already signed up
  // validate that password is not pwned
  // TODO: after datamodel is updated, register the user
}

interface RequestResetArgs {
  email: string
}
//requestRest(email: String!): SuccessMessage
export async function requestReset(parent, args: RequestResetArgs, ctx: Context) {
  const user = await ctx.db.user({ where: { email: args.email } })
  if (!user) {
    throw new Error(`No such user found for email ${args.email}.`)
  }

  const resetToken = (await promisify(randomBytes)(20)).toString("hex")
  const resetTokenExpiry = Date.now() + 1000 * 60 * 60 // one hour
  await ctx.db.updateUser({
    data: { resetToken, resetTokenExpiry },
    where: { email: args.email },
  })

  const { html } = makeAResponsiveEmail(
    `Your password reset token is here! \n\n <a href="${process.env.FRONTEND}/password-reset?resetToken=${resetToken}">Click Here to reset your password</a>`,
  )

  const mailResponse = await transport.sendMail({
    from: "donotreply@voiceyourstance.com",
    to: user.email,
    subject: "Your Password Reset Token",
    html,
  })
  if (!mailResponse.accepted) {
    throw new Error("Email failed to send.")
  }

  return { message: "Reset token set" }
}

// resetPassword(resetToken: String!, password: String!, confirmPassword: String!): User!
export function resetPassword(parent, args, context: Context) {}
