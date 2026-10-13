const mongoose = require("mongoose");
const initData = require("./data");
const Post = require("../models/post");


const MONGO_URI = 'mongodb://127.0.0.1:27017/namogram';

async function main() {
    await mongoose.connect(MONGO_URI);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log("Couldn't connect with Database");
        console.log(err);
    });


const User = require("../models/user");

const initDB = async () => {
    await Post.deleteMany({});
    await Post.insertMany(initData.data);
    console.log("Posts were initialised");

    const sampleProfiles = [
        { username: "demo", email: "demo@namogram.com", bio: "Tech enthusiast and coffee lover ☕", age: 24, gender: "female" },
        { username: "user_001", email: "user001@example.com", bio: "Wanderlust traveler & landscape photographer 📸", age: 22, gender: "male" },
        { username: "user_002", email: "user002@example.com", bio: "Mountain climber and outdoor adventurer 🏔️", age: 28, gender: "female" },
        { username: "user_003", email: "user003@example.com", bio: "Living mindfully. Nature, yoga, and peace 🌿", age: 32, gender: "male" },
        { username: "user_004", email: "user004@example.com", bio: "Ocean breeze and sunset admirer 🌅", age: 19, gender: "female" },
        { username: "user_005", email: "user005@example.com", bio: "Fitness journey & daily motivation 💪", age: 26, gender: "male" },
        { username: "charlie", email: "charlie@namogram.com", bio: "Design, art, and creative vibes 🎨", age: 30, gender: "other" },
        { username: "jatin", email: "jatin@gmail.com", bio: "Exploring the world one city at a time ✈️", age: 23, gender: "male" },
        { username: "anshkukrejaa", email: "anshkukrejapc@gmail.com", bio: "Creator on NamoGram 🚀 Sharing moments and ideas.", age: 22, gender: "male", accountType: "creator" }
    ];

    for (const p of sampleProfiles) {
        let user = await User.findOne({ username: p.username });
        if (!user) {
            user = new User({
                username: p.username,
                email: p.email,
                bio: p.bio,
                age: p.age,
                gender: p.gender,
                accountType: p.accountType || "private",
                followers: [],
                following: []
            });
            await User.register(user, "password123");
        } else {
            user.age = p.age;
            user.gender = p.gender;
            if (p.accountType) user.accountType = p.accountType;
            await user.save();
        }
    }

    const ansh = await User.findOne({ username: "anshkukrejaa" });
    if (ansh) {
        const followersToAdd = ["demo", "user_001", "user_002", "user_003", "user_004"];
        ansh.followers = Array.from(new Set([...(ansh.followers || []), ...followersToAdd]));
        await ansh.save();
        for (const fUsername of followersToAdd) {
            const fUser = await User.findOne({ username: fUsername });
            if (fUser && !fUser.following.includes("anshkukrejaa")) {
                fUser.following.push("anshkukrejaa");
                await fUser.save();
            }
        }
    }

    console.log("Users and followers were initialised");
}

initDB().then(() => {
    console.log("Database setup complete");
});