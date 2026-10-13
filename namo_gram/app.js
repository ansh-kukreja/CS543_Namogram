const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const postsRouter = require("./routes/post");
const userRouter = require("./routes/user");
const User = require("./models/user")
const Post = require("./models/post");


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


const sessionOptions = {
    secret: "supersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// =====================================================================

app.use(express.static(path.join(__dirname,'/public')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const { ALLOWED_TAGS } = require("./middleware");

// Set global locals for all views
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.activePath = req.path;
    res.locals.allowedTags = ALLOWED_TAGS;
    next();
});

// =====================================================================

app.use("/", userRouter);
app.use("/posts", postsRouter);






// app.get("/testPost", async (req, res) => {
//     let samplePost = new Post({
//         "userId": "anshkukrejaa",
//         caption: "Bangur Cement! Sasta nhi sabse acha..",
//         tags: ["promotion", "advertisement", "marketing"],
//         uploadTime: new Date(),
//         commentId: "ajddikdiikvf",
//         likes: ["ansh", "kukreja", "mongoBhai", "simran"],
//     });

//     await samplePost.save();
//     console.log("Post was saved");
//     res.send("Success");
// });


// =====================================================================


app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});