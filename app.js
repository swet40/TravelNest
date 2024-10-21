const express= require("express");
const app = express();
const mongoose= require("mongoose");
// const Listing = require("./models/listings");
const path = require("path");
const methodOverride= require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const flash = require("connect-flash");
const session = require("express-session");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const { clear } = require("console");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
}).catch(err => console.log(err));
async function main() {
await mongoose.connect(mongo_url);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));//to use css files

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(session({
    secret: 'yourSecretKeyHere',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/demouser",async(req,res)=>{
    let fakeUser = new User({
        email: "student12@gmail.com",
        username: "student",
    });
    let registeredUser = await User.register(fakeUser, "helloWorld");
    res.send(registeredUser);
})

app.get('/',(req,res)=>{
    res.send('Hi I am root');
})

// app.use(session(sessionOptions));
// app.use(flash());

app.use('/listing',listings);
app.use('/',reviews);

app.all("*",(req,res,next) => {
    next(new ExpressError(404, "Page not found!"));
})

app.use((err,req,res,next)=>{
    const {statusCode=500, message= "something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{ message, statusCode });
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})