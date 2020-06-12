export interface TypedLob {
  letters: LettersAPI
}

/**
 * Addresses API
 */
interface Address {
  id: string
  description: string | null
  name: string | null
  company: string | null
  phone: string | null
  email: string | null
  address_line1: string
  address_line2: null
  address_city: string
  address_state: string
  address_zip: string
  address_country: string
  metadata: {}
  date_created: string
  date_modified: string
  deleted: boolean
  object: string
}

/**
 * Letters API
 */
interface LettersAPI {
  create: (letter: NewLetter) => Promise<LetterResponse>
}

interface NewLetter {
  description: string
  to: {
    name: string
    address_line1: string
    address_line2?: string
    address_city: string
    address_state: string
    address_zip: string
  }
  from: {
    name: string
    address_line1: string
    address_line2: string
    address_city: string
    address_state: string
    address_zip: string
  }
  file: string
  merge_variables?: {
    [x: string]: string
  }
  color: false
}

export enum ADDRESS_PLACEMENT {
  top_first_page = "top_first_page",
  insert_blank_page = "insert_blank_page",
}

interface CustomEnvelope {
  id: string
  url: string
  object: "envelope"
}

interface TrackingEvent {
  id: string
  name: string
  location: string
  time: string
  date_created: string
  date_modified: string
  object: string
}

interface Thumbnails {
  small: string
  medium: string
  large: string
}

interface LetterResponse {
  id: string
  description: string
  metadata: {}
  to: Address
  from: Address
  color: boolean
  double_sided: boolean
  address_placement: ADDRESS_PLACEMENT
  return_envelope: boolean
  perforated_page: number | null
  custom_envelope: CustomEnvelope | null
  extra_service: string | null
  mail_type: string
  url: string
  template_id: string | null
  carrier: "USPS"
  tracking_number: string | null
  tracking_events: TrackingEvent[]
  thumbnails: Thumbnails[]
  merge_variables: object
  expected_delivery_date: string
  date_created: string
  date_modified: string
  send_date: string
  object: "letter"
}
