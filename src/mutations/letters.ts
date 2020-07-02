import crypto from "crypto"
import { Context, AddressInput, CreateLetterArgs, UpdateLetterArgs, MailLetterArgs } from "../types"
import stripe from "../apis/stripe"
import lob from "../apis/lob"
import { generateHTML, saveAddressIfNew } from "../utilities"

/**
 * Save a new letter to the database
 */
export async function createLetter(parent, args: CreateLetterArgs, ctx: Context) {
  const {
    letter: {
      content,
      fromAddressCity,
      fromAddressLine1,
      fromName,
      fromAddressState,
      fromAddressZip,
      toAddressCity,
      toAddressLine1,
      toName,
      toAddressState,
      toAddressZip,
      templateId,
    },
  } = args

  // To Address
  const toHash = await saveAddressIfNew(ctx, toName, toAddressLine1, toAddressCity, toAddressState, toAddressZip)

  // From Address
  const fromHash = await saveAddressIfNew(
    ctx,
    fromName,
    fromAddressLine1,
    fromAddressCity,
    fromAddressState,
    fromAddressZip,
  )

  // save the letter
  return ctx.db.createLetter({
    content,
    fromAddress: { connect: { hash: fromHash } },
    toAddress: { connect: { hash: toHash } },
    user: ctx.userId && { connect: { id: ctx.user.id } },
    template: templateId && { connect: { id: templateId } },
  })
}

/**
 * Update the from information or the content of a letter
 */
export async function updateLetter(parent, args: UpdateLetterArgs, ctx: Context) {
  const { from, letterId, content } = args
  let fromHash = ""
  if (from) {
    fromHash = await saveAddressIfNew(
      ctx,
      from.fromName,
      from.fromAddressLine1,
      from.fromAddressCity,
      from.fromAddressState,
      from.fromAddressZip,
    )
  }
  return ctx.db.updateLetter({
    where: { id: letterId },
    data: {
      fromAddress: from && { connect: { hash: fromHash } },
      content: content,
    },
  })
}

/**
 * mailLetter
 * Actually mail the letter.
 */
export async function mailLetter(parent, args: MailLetterArgs, ctx: Context) {
  const { letterId, stripeId } = args
  // Verify that the stripe id is accurate
  const charge = await stripe.paymentIntents.retrieve(stripeId)
  if (!charge || charge.amount !== 500 || charge.amount !== charge.amount_received || charge.status !== "succeeded") {
    throw new Error("Payment failed")
  }

  ctx.db.createPayment({ stripeId, letter: { connect: { id: letterId } } })

  // Verify the letter hasn't been mailed before
  const hasBeenMailed = await ctx.db.$exists.mail({ letter: { id: letterId } })
  if (hasBeenMailed) {
    throw new Error("This letter has already been sent.")
  }

  // Prepare letter for mailing
  const letter = await ctx.db.letter({ id: letterId })
  const from = await ctx.db.letter({ id: letterId }).fromAddress()
  const to = await ctx.db.letter({ id: letterId }).toAddress()
  const HTML = generateHTML(letter.content)

  const mail = await lob.letters.create({
    description: `${from.name}'s letter to ${to.name}`,
    to: {
      name: to.name,
      address_line1: to.line1,
      address_line2: "",
      address_city: to.city,
      address_state: to.state,
      address_zip: to.zip,
    },
    from: {
      name: from.name,
      address_line1: from.line1,
      address_line2: "",
      address_city: from.city,
      address_state: from.state,
      address_zip: from.zip,
    },
    file: HTML,
    color: false,
  })

  return ctx.db.createMail({
    expectedDeliveryDate: mail.expected_delivery_date,
    lobId: mail.id,
    letter: {
      connect: {
        id: letter.id,
      },
    },
  })
}
