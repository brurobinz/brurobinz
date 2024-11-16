import express from "express"
import cors from "cors"
import { connect } from "mongoose"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRouter.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import commentRoutes from './routes/commentRoute.js';
import helpRouter from "./routes/helpRouter.js"

//config applicaation
const app = express()
const port = 4000

//middleware

app.use(express.json())
app.use(cors())

//db connection
connectDB()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
        process.exit(1);
    });

//API endpoints
app.use("/api/food",foodRouter)

app.use("/images",express.static('uploads'))

app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use('/api/comments', commentRoutes);
app.use('/api/help', helpRouter);


app.get("/",(req,res)=>{
    res.send("API working")
})

  

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)

})

//mongodb+srv://cuongmp40:24112004@cluster0.t69gm.mongodb.net/?