var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Item = require("./models/item");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var seedDB = require("./seed");

var commentRoutes = require("./routes/comments"),
    itemRoutes = require("./routes/items"),
    indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/revvue");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

app.use(require("express-session")({
    secret: "asdfasdfwej",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/items", itemRoutes);
app.use("/items/:id/comments", commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Started"); 
});