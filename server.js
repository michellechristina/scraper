var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request = require("request");
var exphbs  = require('express-handlebars');


var PORT = 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

 // handlebars
 app.engine('handlebars', exphbs({defaultLayout: 'main'}));
 app.set('view engine', 'handlebars');
  
 app.get('/', function (req, res) {
     res.render('home');
 });

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
  useMongoClient: true
});

// When the server starts, create and save a new Article document to the db
// The "unique" rule in the Library model's schema will prevent duplicate libraries from being added to the server
// db.Articles
//   .create({ name: "Articles" })
//   .then(function(dbArticles) {
//     // If saved successfully, print the new Library document to the console
//     console.log(dbArticles);
//   })
//   .catch(function(err) {
//     // If an error occurs, print it to the console
//     console.log(err.message);
//   });

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
    // Make a request for the news section of ycombinator
    request("https://news.ycombinator.com/", function(error, response, html) {
      // Load the html body from request into cheerio
      var $ = cheerio.load(html);
      // For each element with a "title" class
      $(".title").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var headline = $(element).children("a").text();
        var summary = "a summary of things";
        var url = $(element).children("a").attr("href");
  
        // If this found element had both a title and a link
        if (headline && url) {
          // Insert the data in the scrapedData db
          db.Articles.create({
            headline: headline,
            summary: summary,
            url: url
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
        }
      });
    });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
  });
  
 


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
