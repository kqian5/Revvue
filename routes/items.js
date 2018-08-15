var express = require("express");
var router = express.Router();
var Item = require("../models/item");

router.get("/", function(req, res){
    Item.find({}, function(err, items){
       if (err) {
           console.log(err);
       } else {
           res.render("items/index", {items: items});
       }
    });
});

router.post("/", isLoggedIn, function(req, res){
    var name = req.body.name;
    var img = req.body.image;
    var descrip = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newItem = {name: name, image: img, description: descrip, author: author};
    Item.create(newItem, function(err, newlyCreated){
        if (err) {
            console.log(err);  
        } else {
            res.redirect("/items"); 
        }
    });
});

router.get("/new", isLoggedIn, function(req, res){
    res.render("items/new"); 
});

router.get("/:id", function(req, res){
    Item.findById(req.params.id).populate("comments").exec(function(err, foundItem){
       if (err) {
           console.log(err);
       } else {
           res.render("items/show", {item: foundItem});
       }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;