import { NextFunction, Request, Response } from 'express'
import TokenService from '../services/token.service'
import { parseSortParam } from '../utils/sort'

export default class TokenController {
 public tokenService = new TokenService()

 public getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
 ): Promise<void> => {
  try {
   const { userAddress } = req.params
   const { index, size, sort, ...filters } = req.query

   const page = parseInt(String(index)) || 1
   const limit = parseInt(String(size)) || 10
   const sortOption = parseSortParam(String(sort))
   const query = {
    $or: [{ from: userAddress }, { to: userAddress }],
    ...filters,
   }

   const transactions = await this.tokenService.getTransactions({
    limit,
    page,
    query,
    sort: sortOption,
   })

   res.json(transactions)
  } catch (error) {
   next(error)
  }
 }
}
