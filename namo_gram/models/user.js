const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "Welcome to my NamoGram profile!",
    },
    followers: {
        type: [String],
        default: [],
    },
    following: {
        type: [String],
        default: [],
    },
    accountType: {
        type: String,
        enum: ['private', 'creator'],
        default: 'private',
    },
    age: {
        type: Number,
        min: 13,
        max: 120,
        default: 22,
    },
    gender: {
        type: String,
        enum: ['female', 'male', 'other', 'unspecified'],
        default: 'unspecified',
    },
    avatar: {
        type: String,
        default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
    },
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);