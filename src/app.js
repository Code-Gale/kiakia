const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')

const app = express()
dotenv.config()
connectDB()

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//custom middlewares
app.use('/api/v1/', authRoutes)
app.get('/', (req, res) => {
    res.status(200).json({
        mesage : 'Welcome to KiaKia'
    })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})