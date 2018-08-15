var express = require("express");
var router = express.Router({mergeParams: true});
var Item = require("../models/item");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res){
    Item.findById(req.params.id, function(err, item){
       if (err){
            console.log(err);
       } else {
            res.render("comments/new", {item: item});    
       }
    });
});

router.post("/", isLoggedIn, function(req, res){
   Item.findById(req.params.id, function(err, item){
      if (err){
          console.log(err);
          res.redirect("/items");
      } else {
          Comment.create(req.body.comment, function(err, comment) {
              if (err) {
                  console.log(err);
              } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    item.comments.push(comment);
                    item.save();
                    res.redirect("/items/" + item._id);    
              }
          });
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