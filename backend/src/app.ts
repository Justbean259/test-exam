import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import { NextFunction, Request, Response } from 'express'
import { dbConnection } from './database'
import { Routes } from './interfaces/routes.interface'
import errorMiddleware from './middlewares/error.middleware'
import { TokenLogJob } from './schedules/tokenLogCrawler'

class App {
 public app: express.Application
 public env: string
 public port: string | number

 constructor(routes: Routes[]) {
  this.app = express()
  this.env = process.env.NODE_ENV || 'development'
  this.port = process.env.PORT || 3000

  this.initializeMiddlewares()
  this.initializeRoutes(routes)
  this.initialSchedule()
  this.initializeErrorHandling()
 }

 public listen() {
  this.app.listen(this.port, () => {
   console.log(`=================================`)
   console.log(`======= ENV: ${this.env} =======`)
   console.log(`🚀 App listening on the port ${this.port}`)
   console.log(`=================================`)
  })
 }

 public getServer() {
  return this.app
 }

 private initializeRoutes(routes: Routes[]) {
  routes.forEach((route) => {
   this.app.use('/', route.router)
  })
 }

 private initializeErrorHandling() {
  this.app.use(errorMiddleware)
 }

 private initialSchedule() {
  TokenLogJob()
 }

 private initializeMiddlewares() {
  const corsOptions: cors.CorsOptions = {
   origin: true,
   credentials: true,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
   ],
  }

  this.app.use(cors(corsOptions))
  this.app.use(express.json())
  this.app.use(express.urlencoded({ extended: true }))
  this.app.use(cookieParser())
 }
}

export default App
