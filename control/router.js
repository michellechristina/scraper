var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");


// Require all models
var db = require("../models");

var router = express.Router();

function getTheNews(req, res) {

    // Make a request for the news section of ycombinator
    request("http://www.echojs.com/", function (error, response, html) {
        // Load the html body from request into cheerio
        var $ = cheerio.load(html);

        //save scraped news in here
        var results = [];
        // console.log("results");
        // console.log(results);

        // For each element with a "h2" class
        $("article h2").each(function (i, element) {
            // console.log("element");
            //   console.log(element);
            // Save the text and href of each link enclosed in the current element
            var headline = $(element).children("a").text();
            var summary = "a summary of things";
            var url = $(element).children("a").attr("href");


            // console.log("headline");
            // console.log(headline);
            results.push({
                headline: headline,
                summary: summary,
                url: url
            });
        
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

module.exports = router;