import { Context, LetterInput, AddressInput } from "../types"
import stripe from "../apis/stripe"
import lob from "../apis/lob"
import { generateHTML } from "../utilities"

interface CreateLetterArgs {
  letter: LetterInput
}

export function createLetter(parent, args: CreateLetterArgs, context: Context) {
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
    },
  } = args

  return context.db.createLetter({
    content: content,
    fromCity: fromAddressCity,
    fromLine1: fromAddressLine1,
    fromName: fromName,
    fromState: fromAddressState,
    fromZip: fromAddressZip,
    toCity: toAddressCity,
    toLine1: toAddressLine1,
    toName: toName,
    toState: toAddressState,
    toZip: toAddressZip,
  })
}

interface UpdateLetterArgs {
  letterId: string
  letter: AddressInput
}

export function updateLetter(parent, args: UpdateLetterArgs, context: Context) {
  return context.db.updateLetter({
    where: { id: args.letterId },
    data: {
      fromName: args.letter.fromName,
      fromLine1: args.letter.fromAddressLine1,
      fromCity: args.letter.fromAddressCity,
      fromState: args.letter.fromAddressState,
      fromZip: args.letter.fromAddressZip,
    },
  })
}

/**
 * mailLetter
 * Actually mail the letter.
 */
interface MailLetterArgs {
  letterId: string
  stripeId: string
}

export async function mailLetter(parent, args: MailLetterArgs, context: Context) {
  const { letterId, stripeId } = args
  // Verify that the stripe id is accurate
  const charge = await stripe.paymentIntents.retrieve(stripeId)
  if (!charge || charge.amount !== 500 || charge.amount !== charge.amount_received || charge.status !== "succeeded") {
    throw new Error("Payment failed")
  }

  const letter = await context.db.letter({ id: letterId })
  context.db.updateLetter({
    where: { id: letter.id },
    data: { payment: { create: { stripeId: charge.id } } },
  })

  // Verify the letter hasn't been mailed before
  const mailed = await context.db.mails({ where: { letter: { id: letter.id } } })
  if (mailed.length) {
    throw new Error("This letter has already been sent.")
  }

  const HTML = generateHTML(letter.content)

  const mail = await lob.letters.create({
    description: `${letter.fromName}'s letter to ${letter.toName}`,
    to: {
      name: letter.toName,
      address_line1: letter.toLine1,
      address_line2: "",
      address_city: letter.toCity,
      address_state: letter.toState,
      address_zip: letter.toZip,
    },
    from: {
      name: letter.fromName,
      address_line1: letter.fromLine1,
      address_line2: "",
      address_city: letter.fromCity,
      address_state: letter.fromState,
      address_zip: letter.fromZip,
    },
    file: HTML,
    color: false,
  })

  return context.db.createMail({
    expectedDeliveryDate: mail.expected_delivery_date,
    lobId: mail.id,
    letter: {
      connect: {
        id: letter.id,
      },
    },
  })
}
