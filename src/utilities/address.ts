import crypto from "crypto"
import { Context } from "../types"

export function hashAddress(name: string, line1: string, city: string, state: string, zip: string) {
  const lowerName = name.toLowerCase()
  const lowerLine1 = line1.toLowerCase()
  const lowerCity = city.toLowerCase()
  const lowerState = state.toLowerCase()
  const lowerZip = zip.toLowerCase()

  const s = `${lowerName}${lowerLine1}${lowerCity}${lowerState}${lowerZip}`
  return crypto.createHash("sha1").update(s).digest("base64")
}

export async function saveAddressIfNew(
  ctx: Context,
  name: string,
  line1: string,
  city: string,
  state: string,
  zip: string,
) {
  const hash = hashAddress(name, line1, city, state, zip)
  await ctx.db.upsertAddress({ where: { hash }, create: { hash, city, line1, name, state, zip }, update: {} })
  return hash
}
