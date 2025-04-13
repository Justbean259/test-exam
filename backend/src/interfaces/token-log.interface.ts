export interface ITokenLog {
 _id?: string
 blockNumber: number
 transactionHash: string
 from: string
 to: string
 value: string
 gasPrice: {
  value: string
  unit: string
 }
 timestamp: number
}
