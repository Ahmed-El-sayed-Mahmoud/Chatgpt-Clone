const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true
  },
  text: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  image:{
    type:String,
  }

});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  name:{
        type: String,
        required: true,
  },
  messages: [messageSchema]
});

const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = Conversation;
