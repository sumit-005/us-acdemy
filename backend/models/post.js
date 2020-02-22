const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title:{ type: String },
    company: { type: String },
    description: String ,
    email: { type: String },
    mblno: { type: String },
    gender: String,
    designation:{ type: String },
    bday: { type: String },
    imagePath: {type: String  }
});

module.exports = mongoose.model('Post',postSchema);
