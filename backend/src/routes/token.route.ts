import TokenController from '../controllers/token.controller'
import { Router } from 'express'
import { Routes } from '../interfaces/routes.interface'

export class TokenRoute implements Routes {
 public path = '/token'
 public router = Router()
 public tokenController = new TokenController()

 constructor() {
  this.initializeRoutes()
 }

 private initializeRoutes() {
  this.router.get(
   `${this.path}/:userAddress/history`,
   this.tokenController.getHistory,
  )
 }
}
