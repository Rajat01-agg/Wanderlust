const express = require("express")
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
    .get(userController.renderSignupForm) 
    .post(wrapAsync(userController.signup));


router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectedUrl,
        passport.authenticate("local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }),
        wrapAsync(userController.login));


router.get("/logout", userController.logout);

// About, Privacy and Terms pages
router.get("/about", (req, res) => {
    res.render("about.ejs");
});

router.get("/privacy", (req, res) => {
    res.render("privacy.ejs");
});

router.get("/terms", (req, res) => {
    res.render("terms.ejs");
});


module.exports = router;