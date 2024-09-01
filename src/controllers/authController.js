//signup, login, logout, forgot password, reset password
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const signup = async (req, res) => {
    try{
        const { name, email, password, phoneNumber, userRole } = req.body
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({ message : 'User already exists...'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            userRole
        })
        await newUser.save()

        res.status(201).json({ message : 'User Created Succesfully. Please proceed to login...', newUser})
    }
    catch(err){
        res.status(500).json({ message : 'Internal Server Error', err})
        console.log(err)
    }
}

const login = async (req, res) => {
    try{
        const { email, password } = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({ message : 'User Not Found...'})
        }
        const isUser = await bcrypt.compare(password, user.password)
        if(!isUser){
            return res.status(400).json({ message : 'Invalid Credentials...'})
        }

        const payload = {
            userId : user._id,
            userRole : user.userRole
        }
        const secretKey = process.env.SECRET_KEY
        const options = {
            expiresIn : '3h'
        }
        const token = jwt.sign(payload, secretKey, options)
        const role = user.userRole
        res.status(200).json({ message : 'User logged in Successfully', token, role})
    }
    catch(err){
        res.status(500).json({ message : 'Intenal Server Error', err})
        console.log(err)
    }
}

const forgotPassword =  async ( req, res) => {
    try{
        const { email } = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({ message : 'User Not Found...'})
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken
        user.resetPasswordExpires = Date.now() + 3600000
        await user.save()

        res.status(200).json({message : 'Reset Token generated', resetToken})

    }
    catch(err){
        res.status(500).json({ messgae : 'Internal Server Error', err})
        console.log(err)
    }
}

const resetPassword = async (req, res) => {
    try{
        const { token } = req.params
        const { newPassword} = req.body

        const user = await User.findOne({
            resetPasswordToken : token,
            resetPasswordExpires: { $gt: Date.now() }
        })
        if(!user){
            return res.status(400).json({ message : 'Invalid token...'})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetPasswordExpires = undefined
        user.resetPasswordToken = undefined
        await user.save()

        res.status(200).json({ message : 'Password reset successfully... Please proceed to login'})
    }
    catch(err){
        res.status(500).json({ message : 'Internal Server Error', err})
        console.log(err)
    }
}

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword
}