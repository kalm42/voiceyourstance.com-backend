import { createHash } from "crypto"
import fetch from "node-fetch"
import { Context } from "../types"
import crypto from "crypto"
import jwt from "jsonwebtoken"

export function requireLoggedInUser(ctx: Context) {
  if (!ctx.user) {
    throw new Error("You must be logged in to perform this action.")
  }
}

export async function isPwndPassword(password: string) {
  const hash = createHash("sha1").update(password).digest("hex")
  const hashPrefix = hash.substr(0, 5)
  const hashSuffix = hash.substr(5).toUpperCase()
  const url = `https://api.pwnedpasswords.com/range/${hashPrefix}`

  try {
    const res = await fetch(url)
    // Was fetch successful
    if (res.status !== 200 && res.status !== 404) {
      throw new Error(`Failed to fetch password comparisons. Status Code ${res.status}`)
    }
    // Password was not found, password is not pwned, password is safe to use
    if (res.status === 404) {
      return false
    }

    // Might have match
    const matchingHash = await res.text()

    const hashes = matchingHash
      .split("\r\n")
      .map((line) => line.split(":"))
      .filter((line) => line[0] === hashSuffix)

    if (hashes.length) {
      const matchedHash = hashes.shift()
      if (matchedHash.length) {
        return true
      }
    }
    return false
  } catch (error) {
    throw error
  }
}

export function promiseRandomBytes(bytes: number): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(bytes, (err, buf) => {
      if (err) {
        reject(err)
      }
      resolve(buf.toString("hex"))
    })
  })
}

export function createJWT(userId: string) {
  return jwt.sign({ userId }, process.env.APP_SECRET)
}

export function setCookie(token: string, ctx: Context) {
  ctx.res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
  })
}
