import { createHash } from "crypto"
import fetch from "node-fetch"
import { Context } from "../types"

export function isLoggedInUser(ctx: Context) {
  if (!ctx.userId) {
    throw new Error("You must be logged in to perform this action!")
  }
  return true
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
    // TODO: report error
    throw error
  }
}
