
const Joi = require('joi')
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/To-DoListProject")



const userSchema = new mongoose.Schema({
  userid: {
   type: mongoose.Schema.Types.ObjectId, // Reference to the User schema
    ref: 'userTask'
  },
 
  username: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Ensures that each email is unique
    lowercase: true,  // Converts email to lowercase before saving
    trim: true,  // Removes any extra spaces
  },
}, 
{ timestamps: true

 });

 //joi validator

 function userValidator(data){
 

const Schema = Joi.object({
 
  username: Joi.string()
    .required()
    .min(3)
    .max(30)
    .messages({
      'string.empty': 'Username is required.',
      'string.min': 'Username must be at least 3 characters long.',
      'string.max': 'Username must be at most 30 characters long.',
    }),
  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 6 characters long.',
    }),
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.empty': 'Email is required.',
      'string.email': 'Email must be a valid email address.',
    }),
   

});

let {error}=Schema.validate(data)
return error;

 }
 let userModel =  mongoose.model('user', userSchema);
module.exports={userModel,userValidator}


