const { ref } = require('joi');
const mongoose = require('mongoose');

// Define the task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Task title is required
    trim: true,     // Removes leading/trailing spaces
  },
  description: {
    type: String,
    required: false, // Task description is optional
    trim: true,      // Removes leading/trailing spaces
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'], // Task status can only be Pending or Completed
    default: 'Pending', // Default status is Pending
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the task creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically sets the task update date
  },
 
  userid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
  }, 

 
},
{timestamps:true});

// Create the Task model


module.exports = mongoose.model('userTask',taskSchema)
