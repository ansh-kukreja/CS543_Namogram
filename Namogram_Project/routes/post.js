const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const { isLoggedIn, ALLOWED_TAGS } = require("../middleware");

// ----- Home Feed (All Posts) -----
router.get("/", isLoggedIn, async (req, res) => {
    const { tag } = req.query;
    let query = {};
    if (tag && ALLOWED_TAGS.includes(tag)) {
        query.tags = tag;
    }
    const allPosts = await Post.find(query).sort({ uploadTime: -1 });
    res.render("posts/index.ejs", { allPosts, currentTag: tag || null, allowedTags: ALLOWED_TAGS });
});

// ----- Create New Post Form -----
router.get("/new", isLoggedIn, (req, res) => {
    res.render("posts/new.ejs", { allowedTags: ALLOWED_TAGS, error: null });
});

// ----- Show Single Post -----
router.get("/:id", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.redirect("/posts");
        }
        res.render("posts/show.ejs", { post });
    } catch (err) {
        res.redirect("/posts");
    }
});

// ----- Create Post Handler -----
router.post("/", isLoggedIn, async (req, res) => {
    try {
        const { image, caption } = req.body.post || {};
        let rawTags = req.body.post?.tags || [];

        if (!image || !image.trim()) {
            return res.render("posts/new.ejs", { 
                allowedTags: ALLOWED_TAGS, 
                error: "Image URL is required. Please provide a valid URL." 
            });
        }

        // Tags must be an array
        if (!Array.isArray(rawTags)) {
            rawTags = [rawTags];
        }

        // Filter valid pre-written tags
        const selectedTags = rawTags.filter(t => ALLOWED_TAGS.includes(t));

        // Enforce min 1 and max 3 tags
        if (selectedTags.length < 1 || selectedTags.length > 3) {
            return res.render("posts/new.ejs", { 
                allowedTags: ALLOWED_TAGS, 
                error: "Please choose at least 1 and at most 3 tags from the list." 
            });
        }

        const newPost = new Post({
            userId: req.user.username,
            image: image.trim(),
            caption: caption ? caption.trim() : "",
            tags: selectedTags,
            uploadTime: new Date(),
            likes: []
        });

        await newPost.save();
        res.redirect("/posts");
    } catch (err) {
        console.error("Error creating post:", err);
        res.render("posts/new.ejs", { 
            allowedTags: ALLOWED_TAGS, 
            error: "Failed to create post. Please try again." 
        });
    }
});

// ----- Like / Unlike Post -----
router.post("/:id/like", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const username = req.user.username;
        const alreadyLiked = post.likes.includes(username);

        if (alreadyLiked) {
            // Unlike
            post.likes = post.likes.filter(u => u !== username);
        } else {
            // Like
            post.likes.push(username);
        }

        await post.save();

        const isAjax = req.xhr || 
                       (req.headers.accept && req.headers.accept.includes("json")) ||
                       req.headers["x-requested-with"] === "XMLHttpRequest";

        if (isAjax) {
            return res.json({
                success: true,
                liked: !alreadyLiked,
                likeCount: post.likes.length,
                likes: post.likes,
            });
        }

        res.redirect(req.headers.referer || "/posts");
    } catch (err) {
        console.error("Like error:", err);
        res.redirect("/posts");
    }
});

// ----- Edit Post Form -----
router.get("/:id/edit", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.redirect("/posts");
        }
        if (post.userId !== req.user.username) {
            return res.redirect("/posts/" + id);
        }
        res.render("posts/edit.ejs", { post, allowedTags: ALLOWED_TAGS, error: null });
    } catch (err) {
        res.redirect("/posts");
    }
});

// ----- Update Post Handler -----
router.put("/:id", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.redirect("/posts");
        }
        if (post.userId !== req.user.username) {
            return res.status(403).send("Unauthorized to edit this post");
        }

        const { image, caption } = req.body.post || {};
        let rawTags = req.body.post?.tags || [];
        if (!Array.isArray(rawTags)) rawTags = [rawTags];
        const selectedTags = rawTags.filter(t => ALLOWED_TAGS.includes(t));

        if (selectedTags.length < 1 || selectedTags.length > 3) {
            return res.render("posts/edit.ejs", { 
                post, 
                allowedTags: ALLOWED_TAGS, 
                error: "Please choose at least 1 and at most 3 tags." 
            });
        }

        if (image) post.image = image.trim();
        post.caption = caption ? caption.trim() : "";
        post.tags = selectedTags;

        await post.save();
        res.redirect("/posts/" + id);
    } catch (err) {
        res.redirect("/posts");
    }
});

// ----- Delete Post -----
router.delete("/:id", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.redirect("/posts");
        }
        if (post.userId !== req.user.username) {
            return res.status(403).send("Unauthorized to delete this post");
        }

        await Post.findByIdAndDelete(id);
        res.redirect("/posts");
    } catch (err) {
        res.redirect("/posts");
    }
});

module.exports = router;