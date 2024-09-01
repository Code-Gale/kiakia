const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const URI = process.env.DBURI

const connectDB = async () => {
    try{
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Database connection successful')
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectDB