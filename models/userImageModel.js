const mongoose = require('mongoose');

const userImageSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  image: {
    type: String, // Store the image file name or path
  },
});

const UserImage = mongoose.model('UserImage', userImageSchema);

module.exports = UserImage;
