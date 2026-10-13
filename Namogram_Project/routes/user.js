const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Post = require("../models/post");
const { isLoggedIn, redirectIfLoggedIn } = require("../middleware");

// ----- Root Route -----
router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/posts");
    }
    res.redirect("/login");
});

// ----- API: Check Username Availability -----
router.get("/api/check-username", async (req, res) => {
    try {
        const username = (req.query.username || "").trim().toLowerCase();
        if (!username) {
            return res.json({ available: false, message: "Username cannot be empty." });
        }
        if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
            return res.json({ 
                available: false, 
                message: "Username must be 3-30 letters, numbers, or underscores." 
            });
        }
        const userExists = await User.findOne({ username });
        const postExists = await Post.exists({ userId: username });
        if (userExists || postExists) {
            return res.json({ available: false, message: "Username is already taken." });
        }
        return res.json({ available: true, message: "Username is available!" });
    } catch (err) {
        return res.status(500).json({ available: false, message: "Error checking username." });
    }
});

// ----- SignUp ------
router.get("/signup", redirectIfLoggedIn, (req, res) => {
    res.render("users/signup.ejs", { error: null });
});

router.post("/signup", redirectIfLoggedIn, async (req, res, next) => {
    try {
        const { username, email, password, age, gender } = req.body;
        if (!username || !email || !password) {
            return res.render("users/signup.ejs", { error: "All fields are required." });
        }

        // Clean and validate username (alphanumeric and underscores, no spaces)
        const cleanUsername = username.trim().toLowerCase();
        if (!/^[a-zA-Z0-9_]{3,30}$/.test(cleanUsername)) {
            return res.render("users/signup.ejs", { 
                error: "Username must be 3-30 characters long and contain only letters, numbers, and underscores." 
            });
        }

        const parsedAge = age ? parseInt(age, 10) : 22;
        const validGender = ['female', 'male', 'other', 'unspecified'].includes(gender) ? gender : 'unspecified';

        const newUser = new User({ 
            email: email.trim(), 
            username: cleanUsername,
            age: (!isNaN(parsedAge) && parsedAge >= 13 && parsedAge <= 120) ? parsedAge : 22,
            gender: validGender
        });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            res.redirect("/posts");
        });
    } catch (err) {
        console.error("Signup error:", err.message);
        res.render("users/signup.ejs", { error: err.message || "Failed to create account." });
    }
});

// ----- Login ------
router.get("/login", redirectIfLoggedIn, (req, res) => {
    res.render("users/login.ejs", { error: null });
});

router.post("/login", redirectIfLoggedIn, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.render("users/login.ejs", { 
                error: info && info.message ? info.message : "Invalid username or password" 
            });
        }
        req.login(user, (err) => {
            if (err) return next(err);
            return res.redirect("/posts");
        });
    })(req, res, next);
});

// ----- Logout ------
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/login");
    });
});

// ----- About NamoGram -----
router.get("/about", (req, res) => {
    res.render("users/about.ejs");
});

// ----- Search Profiles by Username -----
router.get("/search", isLoggedIn, async (req, res) => {
    const q = req.query.q ? req.query.q.trim() : "";
    let matchedUsers = [];

    if (q) {
        // Find registered users matching substring (case insensitive)
        const dbUsers = await User.find({
            username: { $regex: q, $options: "i" }
        }).limit(20);

        // Also check if any posts have this userId (e.g. from sample data)
        const postAuthors = await Post.distinct("userId", {
            userId: { $regex: q, $options: "i" }
        });

        const registeredUsernames = new Set(dbUsers.map(u => u.username));

        matchedUsers = [...dbUsers.map(u => ({
            username: u.username,
            email: u.email,
            avatar: u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
            bio: u.bio || "NamoGram Explorer",
            followers: u.followers || [],
            accountType: u.accountType || "private"
        }))];

        for (const author of postAuthors) {
            if (!registeredUsernames.has(author)) {
                matchedUsers.push({
                    username: author,
                    email: `${author}@namogram.com`,
                    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
                    bio: "NamoGram Creator",
                    followers: [],
                    accountType: "private"
                });
            }
        }
    } else {
        // Show recent or sample users if no query is typed
        const sampleDbUsers = await User.find({}).limit(10);
        matchedUsers = sampleDbUsers.map(u => ({
            username: u.username,
            email: u.email,
            avatar: u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
            bio: u.bio || "NamoGram Explorer",
            followers: u.followers || [],
            accountType: u.accountType || "private"
        }));
    }

    // Attach post count to each user
    const usersWithCounts = await Promise.all(
        matchedUsers.map(async (u) => {
            const count = await Post.countDocuments({ userId: u.username });
            return { ...u, postCount: count };
        })
    );

    res.render("users/search.ejs", { users: usersWithCounts, q });
});

// ----- Follow / Unfollow User -----
router.post("/profile/:username/follow", isLoggedIn, async (req, res) => {
    try {
        const targetUsername = req.params.username;
        const currentUsername = req.user.username;

        if (targetUsername === currentUsername) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }

        let targetUser = await User.findOne({ username: targetUsername });
        if (!targetUser) {
            targetUser = new User({
                username: targetUsername,
                email: `${targetUsername}@namogram.com`,
                bio: "NamoGram Creator",
                followers: [],
                following: []
            });
            await User.register(targetUser, "password123");
        }

        let currentUser = await User.findOne({ username: currentUsername });

        if (!targetUser.followers) targetUser.followers = [];
        if (!currentUser.following) currentUser.following = [];

        const isFollowing = targetUser.followers.includes(currentUsername);

        if (isFollowing) {
            targetUser.followers = targetUser.followers.filter(u => u !== currentUsername);
            currentUser.following = currentUser.following.filter(u => u !== targetUsername);
        } else {
            targetUser.followers.push(currentUsername);
            currentUser.following.push(targetUsername);
        }

        await targetUser.save();
        await currentUser.save();

        const isAjax = req.xhr || 
                       (req.headers.accept && req.headers.accept.includes("json")) ||
                       req.headers["x-requested-with"] === "XMLHttpRequest";

        if (isAjax) {
            return res.json({
                success: true,
                isFollowing: !isFollowing,
                followersCount: targetUser.followers.length,
                followingCount: targetUser.following.length
            });
        }

        res.redirect(`/profile/${targetUsername}`);
    } catch (err) {
        console.error("Follow error:", err);
        res.redirect(`/profile/${req.params.username}`);
    }
});

// ----- Toggle Account Type (Private / Creator) -----
router.post("/profile/account-type", isLoggedIn, async (req, res) => {
    try {
        const { accountType } = req.body;
        if (!['private', 'creator'].includes(accountType)) {
            return res.status(400).json({ error: "Invalid account type" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { accountType },
            { new: true }
        );
        req.user.accountType = accountType;

        const isAjax = req.xhr || 
                       (req.headers.accept && req.headers.accept.includes("json")) ||
                       req.headers["x-requested-with"] === "XMLHttpRequest";

        if (isAjax) {
            return res.json({ success: true, accountType: updatedUser.accountType });
        }

        res.redirect("/profile");
    } catch (err) {
        console.error("Account type switch error:", err);
        res.redirect("/profile");
    }
});

// ----- Edit User Profile (Bio, Age, Gender) -----
router.post("/profile/edit", isLoggedIn, async (req, res) => {
    try {
        const { bio, age, gender } = req.body;
        const updateData = {};
        if (typeof bio === "string") updateData.bio = bio.trim();
        if (age !== undefined && age !== "") {
            const parsedAge = parseInt(age, 10);
            if (!isNaN(parsedAge) && parsedAge >= 13 && parsedAge <= 120) {
                updateData.age = parsedAge;
            }
        }
        if (['female', 'male', 'other', 'unspecified'].includes(gender)) {
            updateData.gender = gender;
        }

        await User.findByIdAndUpdate(req.user._id, updateData);
        res.redirect("/profile");
    } catch (err) {
        console.error("Profile edit error:", err);
        res.redirect("/profile");
    }
});

// ----- Creator Profile Analytics Dashboard -----
router.get("/profile/analytics", isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const isCreator = user.accountType === 'creator';

        // Creator's published posts & total likes received on own posts
        const creatorPosts = await Post.find({ userId: user.username });
        const postsCount = creatorPosts.length;
        const totalLikes = creatorPosts.reduce((sum, p) => sum + (p.likes ? p.likes.length : 0), 0);

        const followerUsernames = user.followers || [];
        const followersCount = followerUsernames.length;
        const followingCount = (user.following || []).length;

        // 1. Fetch all follower user documents from database
        const followerUsers = followerUsernames.length > 0
            ? await User.find({ username: { $in: followerUsernames } })
            : [];
        const followerUserMap = new Map();
        followerUsers.forEach(f => followerUserMap.set(f.username, f));

        // 2. Demographic Breakdown calculated from actual followers
        const genderCounts = { female: 0, male: 0, other: 0, unspecified: 0 };
        const ageGroups = { '13-17': 0, '18-24': 0, '25-34': 0, '35-44': 0, '45+': 0 };

        followerUsernames.forEach(username => {
            const fDoc = followerUserMap.get(username);
            const g = (fDoc && fDoc.gender ? fDoc.gender : 'unspecified').toLowerCase();
            if (g === 'female') genderCounts.female++;
            else if (g === 'male') genderCounts.male++;
            else if (g === 'other') genderCounts.other++;
            else genderCounts.unspecified++;

            const age = fDoc ? fDoc.age : null;
            if (typeof age === 'number' && !isNaN(age) && age > 0) {
                if (age < 18) ageGroups['13-17']++;
                else if (age <= 24) ageGroups['18-24']++;
                else if (age <= 34) ageGroups['25-34']++;
                else if (age <= 44) ageGroups['35-44']++;
                else ageGroups['45+']++;
            }
        });

        // Gender Percentages (based on actual followers with specified gender)
        const totalFollowers = followerUsernames.length;
        const genderPercentages = {
            female: totalFollowers > 0 ? Math.round((genderCounts.female / totalFollowers) * 100) : 0,
            male: totalFollowers > 0 ? Math.round((genderCounts.male / totalFollowers) * 100) : 0,
            other: totalFollowers > 0 ? Math.round((genderCounts.other / totalFollowers) * 100) : 0,
            unspecified: totalFollowers > 0 ? Math.round((genderCounts.unspecified / totalFollowers) * 100) : 0,
        };

        // Determine top concentrated age bracket
        let topAgeBracket = null;
        let maxAgeCount = 0;
        for (const [bracket, count] of Object.entries(ageGroups)) {
            if (count > maxAgeCount) {
                maxAgeCount = count;
                topAgeBracket = bracket;
            }
        }

        // 3. Fetch all posts liked by each of the creator's followers across NamoGram
        const followerLikedPosts = followerUsernames.length > 0
            ? await Post.find({ likes: { $in: followerUsernames } })
            : [];

        // 4. Content Consumption Metrics (Tag analysis of liked posts by followers)
        const tagCounts = {};
        let totalFollowerLikes = 0;
        const followerInsights = [];

        followerUsernames.forEach(username => {
            const fDoc = followerUserMap.get(username);
            const postsLikedByFollower = followerLikedPosts.filter(p => (p.likes || []).includes(username));
            totalFollowerLikes += postsLikedByFollower.length;

            const followerTags = {};
            postsLikedByFollower.forEach(p => {
                (p.tags || []).forEach(t => {
                    const normTag = t.trim().toLowerCase();
                    if (normTag) {
                        tagCounts[normTag] = (tagCounts[normTag] || 0) + 1;
                        followerTags[normTag] = (followerTags[normTag] || 0) + 1;
                    }
                });
            });

            const topFollowerTags = Object.entries(followerTags)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([t]) => t);

            followerInsights.push({
                username,
                avatar: fDoc && fDoc.avatar ? fDoc.avatar : null,
                age: fDoc && fDoc.age ? fDoc.age : "N/A",
                gender: fDoc && fDoc.gender ? fDoc.gender : "unspecified",
                likedCount: postsLikedByFollower.length,
                topTags: topFollowerTags
            });
        });

        // 5. Weekly Interaction Velocity (day-of-week interactions from followers' liked posts)
        const velocityData = [0, 0, 0, 0, 0, 0, 0]; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
        const dayMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 }; // JS getDay(): 0=Sun, 1=Mon...

        followerLikedPosts.forEach(p => {
            if (p.uploadTime) {
                const dayIdx = dayMap[new Date(p.uploadTime).getDay()];
                if (dayIdx !== undefined) {
                    const interactionsOnPost = (p.likes || []).filter(u => followerUsernames.includes(u)).length;
                    velocityData[dayIdx] += interactionsOnPost;
                }
            }
        });

        res.render("users/analytics.ejs", {
            user,
            isCreator,
            postsCount,
            totalLikes,
            followersCount,
            followingCount,
            tagCounts,
            genderCounts,
            genderPercentages,
            ageGroups,
            topAgeBracket,
            maxAgeCount,
            velocityData,
            followerInsights,
            totalFollowerLikes
        });
    } catch (err) {
        console.error("Analytics error:", err);
        res.redirect("/profile");
    }
});

// ----- User Profile -----
router.get("/profile", isLoggedIn, (req, res) => {
    res.redirect(`/profile/${req.user.username}`);
});

router.get("/profile/:username", isLoggedIn, async (req, res) => {
    const { username } = req.params;
    let profileUser = await User.findOne({ username });

    if (!profileUser) {
        // Check if there are posts by this user (sample posts)
        const hasPosts = await Post.exists({ userId: username });
        if (hasPosts) {
            profileUser = {
                username,
                email: `${username}@namogram.com`,
                bio: "Welcome to my NamoGram gallery! Sharing moments and passion.",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop",
                followers: [],
                following: [],
                accountType: "private"
            };
        } else {
            return res.status(404).render("users/profile.ejs", {
                profileUser: null,
                posts: [],
                totalLikes: 0,
                isFollowing: false,
                error: "User not found"
            });
        }
    }

    const posts = await Post.find({ userId: username }).sort({ uploadTime: -1 });
    const totalLikes = posts.reduce((acc, p) => acc + (p.likes ? p.likes.length : 0), 0);
    const isFollowing = profileUser.followers ? profileUser.followers.includes(req.user.username) : false;

    res.render("users/profile.ejs", {
        profileUser,
        posts,
        totalLikes,
        isFollowing,
        error: null
    });
});

module.exports = router;