if (process.env.NODE_ENV != "production") {
    require("dotenv").config(); 
}
 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./util/ExpressError.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const dbUrl = process.env.DB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: process.env.SECRET_KEY,
    touchAfter: 24 * 60 * 60, // time period in seconds
});

store.on("error", function (e) {
    console.log("Session Store Error!", e);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

async function main() {
    await mongoose.connect(dbUrl);
}

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(success);
    next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
    res.render("home");
});


app.all("{*splat}", (req, res, next) => {//{*splat} for all
    next(new ExpressError(404, "Page Not Found"));
});


//Error Handling Middleware
app.use((err, req, res, next) => {
    let { status = 500, message } = err;
    res.status(status).render("./listings/error.ejs", { message });
});


// Start server only after MongoDB connection
main()
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(8080, () => {
            console.log("Server is listening to port 8080");
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });