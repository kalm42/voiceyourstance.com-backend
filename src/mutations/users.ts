import bcrypt from "bcrypt"
import { Context, SignUpArgs, RequestResetArgs, ResetPasswordArgs, SigninArgs } from "../types"
import { isPwndPassword, promiseRandomBytes, transport, createJWT, setCookie, makeANiceEmail } from "../utilities"

/**
 * Signin takes the email address and password finds the corresponding user and if the supplied password matches the
 * hash of the saved password then create a jwt and attach it to an httponly cookie. While not the most secure method
 * for right now it's secure enough.
 *
 * signin(email: String!, password: String!): User!
 */
export async function signin(parent, args: SigninArgs, ctx: Context, info) {
  const { email, password } = args
  const user = await ctx.db.user({ email })
  if (!user) {
    throw new Error(`No such user found for email ${email}.`)
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new Error("Invalid password")
  }
  const token = createJWT(user.id)
  setCookie(token, ctx)

  return user
}

/**
 * Signout clears the cookies from the response and by extension removes it from the client side.
 *
 * signout: SuccessMessage
 */
export function signout(parent, args, ctx: Context) {
  ctx.res.clearCookie("token")
  return { message: "Goodbye" }
}

/**
 * Sign up a new user.
 *
 * signup(email: String!, password: String!): User!
 */
export async function signup(parent, args: SignUpArgs, context: Context, info) {
  const { email, password } = args

  // Validate user is not already registered
  const userExists = await context.db.$exists.user({ email })
  if (userExists) {
    throw new Error("You already have an account. Maybe reset your password and consider using a password manager.")
  }

  // validate that password is not pwned
  if (await isPwndPassword(password)) {
    throw new Error("This password has been compromised and is insecure. Consider using a password manager.")
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Save the user in the database
  const savedUser = await context.db.createUser({
    email: email.toLowerCase(),
    password: hashedPassword,
  })

  // Create jwt token
  const token = createJWT(savedUser.id)

  // Set the jwt token cookie on the response
  setCookie(token, context)

  return savedUser
}

/**
 * Set the reset token and exipiry information in the user's record and let the user know that it's been emailed to them.
 *
 * requestRest(email: String!): SuccessMessage
 */
export async function requestReset(parent, args: RequestResetArgs, ctx: Context) {
  const { email } = args

  // Validate that the user exists
  const user = await ctx.db.user({ email })
  if (!user) {
    throw new Error(`No such user found for email ${email}.`)
  }

  // Create token and expiry timestamp
  const resetToken = await promiseRandomBytes(20)
  const resetTokenExpiry = Date.now() + 1000 * 60 * 60 // one hour
  await ctx.db.updateUser({
    data: { resetToken, resetExpiry: resetTokenExpiry },
    where: { id: user.id },
  })

  // Make the email
  const html = makeANiceEmail(
    `Your password reset token is here! <br />
    <a href="${process.env.FRONTEND}/password-reset?resetToken=${resetToken}">Click Here to reset your password</a><br /><br />
    Or copy and paste this into the browser of your choice.<br />
    ${process.env.FRONTEND}/password-reset?resetToken=${resetToken}
    `,
  )

  // Send the email
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

/**
 * Reset the user's password
 *
 * resetPassword(resetToken: String!, password: String!, confirmPassword: String!): User!
 */
export async function resetPassword(parent, args: ResetPasswordArgs, ctx: Context, info) {
  const { resetToken, password, confirmPassword } = args

  // Find the user by token
  const [user] = await ctx.db.users({ where: { resetToken, resetExpiry_gte: Date.now() } })
  if (!user) {
    throw new Error("Invalid reset token")
  }

  // Validate the two passwords match
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match")
  }

  // Validate password is not pwned
  if (await isPwndPassword(password)) {
    throw new Error("This password has been compromised and is insecure. Consider using a password manager.")
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Update the user's record with the new password
  ctx.db.updateUser({ where: { id: user.id }, data: { password: hashedPassword, resetToken: null, resetExpiry: null } })

  // create the jwt
  const token = createJWT(user.id)

  // set the cookie in the response
  setCookie(token, ctx)

  // return the user
  return ctx.db.user({ id: user.id })
}
