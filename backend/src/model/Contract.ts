import { Schema } from 'mongoose'
import dbCreatedConnection from '../database'

const ContractSchema: Schema<{
 block: number
 contractName: string
}> = new Schema({
 block: { type: Number, required: true },
 contractName: { type: String, required: true, unique: true },
})

const ContractModel = dbCreatedConnection.model<{
 contractName: string
 block: number
}>('Contract', ContractSchema)

export default ContractModel
