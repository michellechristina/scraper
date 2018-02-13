var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");


// Require all models
var db = require("../models");

var router = express.Router();

function getTheNews(req, res) {

    // Make a request for the news section of ycombinator
    request("https://news.ycombinator.com/", function (error, response, html) {
        // Load the html body from request into cheerio
        var $ = cheerio.load(html);

        //save scraped news in here
        var results = [];
        // console.log("results");
        // console.log(results);

        // For each element with a "h2" class
        $(".title").each(function(i, element) {
            // console.log("element");
            //   console.log(element);
            // Save the text and href of each link enclosed in the current element
            var headline = $(element).children("a").text();
            var summary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
            var url = $(element).children("a").attr("href");

            if (headline && url) {
            // console.log("headline");
            // console.log(headline);
            results.push({
                headline: headline,
                summary: summary,
                url: url
            });
        }
        
            // console.log("results");
            // console.log(results);
        });

            // Send data back to the client
            res.render("home", {
                article: results
            });
        
    });
};

router.get('/', function (req, res) {
    res.render('home');
});

router.get('/scrape', function (req, res) {
    getTheNews(req, res);
});



// Route for saving an Article
router.post("/save", function (req, res) {
    // Create a saved article in the db
    console.log("req.body");
    console.log(req.body);
    db.Articles.create(req.body).catch(function (err) {
      // if error, send
        res.json(err);
    });
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Articles.find({})
    .populate("comments")
      .then(function(dbArticle) {
       
       // Send data back to the client
       res.render("articles", {
        article: dbArticle
    });
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  // Route for grabbing a specific Article by id, to delete the comment
  // delete from comments table
router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Articles.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("comments")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


// save a comment
router.post("/articles/:id", function(req, res) {
    db.Comments.create(req.body)
      .then(function(dbComments) {
        return db.Articles.findOneAndUpdate({ _id: req.params.id }, {$push: { comments: dbComments._id }}, { new: true });
      })
      .then(function(data) {
       
        // Send data back to the client
        res.render("articles", {
         comment: data
     });
       })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // save a comment
router.delete("/comments/:id", function(req, res) {
    console.log("Deleted");
    console.log(req.body);
    db.Comments.remove({ _id: req.params.id })
    .then(res.json({msg: "removed"}))
    .catch(console.log)
  });
 

  

module.exports = router;