const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
//@desc Get all contacts
//@router GET /api/contacts
//@access public
const getContact = asyncHandler(async(req,res) => {
    const contacts=await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});

//@desc get individual contact contact contacts
//@router GET /api/contacts/:id
//@access private
const getaContact = asyncHandler(async(req,res) => {
    const contacts = await Contact.findById(req.params.id);
    if(!contacts){
        res.status(404);
        throw new Error ("Contact not found");
    }
    res.status(200).json(contacts);
});


//@desc create a contact 
//@router POST /api/contacts
//@access private
const createContact = asyncHandler(async (req,res) => {
    console.log("The request body is :", req.body );
    const {name,email,phone} = req.body;
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("Improper body data");
    }
    const contacts=await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });
    res.status(201).json(contacts);
});

//@desc update a contact 
//@router PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req,res) => {
    const contacts = await Contact.findById(req.params.id);
    if(!contacts){
        res.status(404);
        throw new Error ("Contact not found");
    }
    if(contacts.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("Not authorized to update this user");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new:true }
    );
    res.status(200).json(updatedContact);
});

//@desc delete a contact 
//@router DELETE /api/contacts/:id
//@access public
const deleteContact = asyncHandler(async (req,res) => {
    const contacts = await Contact.findById(req.params.id);
    if(!contacts){
        res.status(404);
        throw new Error ("Contact not found");
    }
    if(contacts.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("Not authorized to update this user");
    }
    await Contact.deleteOne({_id:req.params.id});
    res.status(200).json(contacts);
});


module.exports = {getContact, createContact, getaContact, updateContact, deleteContact};