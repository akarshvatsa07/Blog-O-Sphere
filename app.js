
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
require('dotenv').config()




const homeStartingContent = "Welcome to my blogging website. Here, you can read blogs written by others, as well as write one of your own. To create a new blog, click on the 'Write your own Blog' at the bottom of the page.";
const aboutContent = "I am a software enthusiast and this is my very first web development project.";
const contactContent = "We will soon have our contact info, till then stay tuned.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });



const postschema = {
  title: String,
  body: String
};

const posts = mongoose.model("posts", postschema);


app.get("/posts/:postid", function (req, res) {

  const rpostid = req.params.postid;

  posts.findOne({ _id: rpostid }, function (err, foundpost) {
    if (!err) {
      res.render('post', { pageContent: foundpost });
    }

  });

});

app.get("/", function (req, res) {
  posts.find({}, function (err, foundposts) {
    if (!err) {
      res.render('home', { homeSC: homeStartingContent, homeposts: foundposts });
    }
  })

});

app.get("/about", function (req, res) {
  res.render('about', { aboutC: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render('contact', { contactC: contactContent });
});

app.get("/compose", function (req, res) {
  res.render('compose');
});



app.post("/compose", function (req, res) {

  var newtitle = req.body.compose;
  var newbody = req.body.postBody;

  posts.findOne({ title: newtitle }, function (err, foundpost) {
    if (!err) {
      if (!foundpost) {
        const post = new posts({
          title: newtitle,
          body: newbody
        })
        post.save();
      }
    }
  });

  res.redirect("/");
});


let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function () {
  console.log("Server has started successfully");
});
