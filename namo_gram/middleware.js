const ALLOWED_TAGS = [
    "fitness",
    "lifestyle",
    "health",
    "study",
    "travel",
    "nature",
    "photography",
    "adventure",
    "motivation",
    "tech",
    "food",
    "fashion"
];

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};

const redirectIfLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/posts");
    }
    next();
};

module.exports = {
    isLoggedIn,
    redirectIfLoggedIn,
    ALLOWED_TAGS,
};
