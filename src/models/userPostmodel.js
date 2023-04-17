const mongoose = require('mongoose');

const UserpostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
   author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    //required: true
  },
  
  likes: [
    { 
      type: mongoose.Schema.Types.ObjectId,
       ref: 'posts',
  }],

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

module.exports = mongoose.model('userPost', UserpostSchema);