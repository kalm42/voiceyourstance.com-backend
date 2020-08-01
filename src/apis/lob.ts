import Lob from "lob"
import { TypedLob } from "../types"

const lob: TypedLob = new Lob(process.env.LOB_KEY, { apiVersion: "2020-02-11" })

export default lob
