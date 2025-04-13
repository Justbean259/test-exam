import { Schema, model, Document } from 'mongoose'
import dbCreatedConnection from '../database'
import { ITokenLog } from '../interfaces/token-log.interface'

const tokenLogSchema: Schema<ITokenLog> = new Schema({
 blockNumber: { type: Number, required: true },
 transactionHash: { type: String, required: true, unique: true },
 from: { type: String, required: true },
 to: { type: String, required: true },
 value: { type: String, required: true },
 gasPrice: {
  value: { type: String, required: true },
  unit: { type: String, required: true },
 },
 timestamp: { type: Number, required: true },
})

const TokenLogModel = dbCreatedConnection.model<ITokenLog>(
 'TokenLog',
 tokenLogSchema,
)

export default TokenLogModel
