const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register User 
//@router POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req,res) => {
    const {username, email, password}=req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("Invalid credentials");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    //Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hashPassword);
    const newuser = await User.create({
        username,
        email,
        password:hashPassword,
    });
    console.log(`User created ${newuser}`);
    if(newuser){
        res.status(201).json({_id: newuser.id, email: newuser.email});
    } else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({message:"register user"});
});

//@desc Login User 
//@router POST /api/user/register
//@access public
const loginUser = asyncHandler(async (req,res) => {
    const{email,password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("all fields mandatory")
    }
    const user= await User.findOne({email});
    //compare password with hashed password
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn:"15m"}
        );
        res.status(200).json({accessToken});
    }else{
        res.status(401)
        throw new Error("email or password is not valid");
    }
});

//@desc Current User 
//@router POST /api/user/current
//@access private
const currentUser = asyncHandler((req,res) => {
    res.json(req.user);
});
module.exports ={registerUser,loginUser,currentUser};