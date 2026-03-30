import User from "../models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export async function createUser(req, res) {
    try {

        const user = await User.findOne({ email: req.body.email })

        if (user != null) {
            res.json({ message: "User already exists" })
            return
        }
        // Create a new user
        // const newUser = new User(req.body) <- mehema karoth security issues thiyenawa, 
        // so we will create a new user object and assign the values one by one

        const passwordHash = bcrypt.hashSync(req.body.password, 10)    
        
        const newUser = new User({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: passwordHash

        })

        await newUser.save()
        
        res.json({ message: "User created successfully" })

    } catch (err) {
        res.json({ message: err.message }

        )
    }
}

export async function loginUser(req, res) {
    try{
        const email = req.body.email
        const password = req.body.password

        if(email == null || password == null) {
            // res.json({ message: "Email and password are required" })
            res.status(400).json({ message: "Email and password are required" })
            return
        }

        const user = await User.findOne( {email : email} )

        if (user == null) {
            // res.json({message : "User not found"})
            res.status(404).json({message : "User not found"})
            return
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password)
        if(isPasswordValid){

            const token = jwt.sign(
                {
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    isAdmin : user.isAdmin,
                    isBlocked : user.isBlocked,
                    isEmailVerified : user.isEmailVerified,
                    image : user.image
                },
                
                "secretkey99!!!!!"
            )

            res.json({message : "Login successful", token : token})

        }else{

            // res.json({message : "Invalid password"})
            res.status(400).json({message : "Invalid password"})
        }

    }catch(err){
        res.json({message : err.message})
        return
    }
}