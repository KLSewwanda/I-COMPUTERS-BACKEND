import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routers/userRouter.js'
import productRouter from './routers/productRouter.js'
import dotenv from 'dotenv'

dotenv.config()

import dns from "node:dns"

import authenticate from './middlewares/authenticate.js'

//test

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const mongoDBURI = process.env.MONGO_URI


mongoose.connect(mongoDBURI).then(
    ()=>{
        console.log("Connected to MongoDB successfully")
    }
)

const app = express()

app.use( express.json() )

app.use(authenticate)


app.use("/users",userRouter)
app.use("/products",productRouter)

app.listen(
    3000 ,
    ()=>{
        console.log('Server started successfully')
        console.log('Listening on port 3000')
    }
)
