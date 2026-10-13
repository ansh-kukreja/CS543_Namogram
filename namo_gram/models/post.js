const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1659885785824-3e72856b8fef?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
        set: (v) => 
            v === "" ? 
                "https://images.unsplash.com/photo-1659885785824-3e72856b8fef?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" 
                : v,
    },
    caption: String,
    tags: [String],
    uploadTime: {
        type: Date,
        default: Date.now,
    },
    commentId: String,
    likes: {
        type: [String],
        default: [],
    },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;