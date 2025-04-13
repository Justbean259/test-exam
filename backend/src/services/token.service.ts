import { timeStamp } from 'console'
import { Pagination } from '../interfaces/common.interface'
import { ITokenLog } from '../interfaces/token-log.interface'
import { HttpException } from '../utils/HttpException'
import { paginate } from '../utils/paginate'
import TokenLogModel from '../model/Token'

class TokenService {
 public getTransactions = async ({
  limit,
  page,
  query,
  sort = { timestamp: -1 },
 }: {
  limit: number
  page: number
  query: Record<string, any>
  sort?: Record<string, any>
 }) => {
  try {
   const getAllTransactionTypes = await paginate<Pagination<ITokenLog>>({
    model: TokenLogModel,
    filter: query,
    page: page,
    limit: limit,
    sort: sort,
   })
   return getAllTransactionTypes
  } catch (error) {
   throw new HttpException(500, 'Internal server error')
  }
 }
}

export default TokenService
