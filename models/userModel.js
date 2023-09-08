const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username : {
        type: String,
        required: [true, "please add username"],
    },
    email :{
        type: String,
        required: [true, "please add user email"],
        unique: [true, "email used"],
    },
    password:{
        type: String,
        required: [true,"please add a password"],
    },
},
{
    timestamps:true,
});

module.exports = mongoose.model("user", userSchema);
