var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request = require("request");
var exphbs = require('express-handlebars');
var axios = require("axios");


var PORT = 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views/'));

// handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({
    extended: false
}));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
    //   useMongoClient: true
});

app.get('/', function (req, res) {
    res.render('home');
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
// app.get("/scrape", function(req, res) {
//     // Make a request for the news section of ycombinator
//     request("https://news.ycombinator.com/", function(error, response, html) {
//       // Load the html body from request into cheerio
//       var $ = cheerio.load(html);
//       // For each element with a "title" class
//       $(".title").each(function(i, element) {
//         // Save the text and href of each link enclosed in the current element
//         var headline = $(element).children("a").text();
//         var summary = "a summary of things";
//         var url = $(element).children("a").attr("href");

//         // If this found element had both a title and a link
//         if (headline && url) {
//           // Insert the data in the scrapedData db
//           db.Articles.create({
//             headline: headline,
//             summary: summary,
//             url: url
//           },
//           function(err, inserted) {
//             if (err) {
//               // Log the error if one is encountered during the query
//               console.log(err);
//             }
//             else {
//               // Otherwise, log the inserted data
//               console.log(inserted);
//             }
//           });
//         }
//       });
//     });

//     // Send a "Scrape Complete" message to the browser
//     res.send("Scrape Complete");
//   });



////////////////

// Routes

// A GET route for scraping the echojs website
app.get("/scrape", function (req, res) {
// First, we grab the body of the html with request
axios.get("https://medium.com/")
    .then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        var results = [];
        // Now, we grab every h2 within an article tag, and do the following:
        // $("article h2").each(function (i, element) {
        //         // Save an empty result object

        //         var result = {};

        //         // Add the text and href of every link, and save them as properties of the result object
        //         result.title = $(this)
        //             .children("a")
        //             .text();
        //         result.link = $(this)
        //             .children("a")
        //             .attr("href");

        $("h3.ui-h2.ui-xs-h4.ui-clamp3").each(function (i, element) {
console.log(element);
            var link = $(element).attr("href");
            var title = $(element).text();

            
            results.push({
                title: title,
                link: link
            });
        });
        console.log("title");
console.log(results);
        // Create a new Article using the `result` object built from scraping
        db.Article.create(results)
            .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
                // If we were able to successfully scrape and save an Article, send a message to the client

            })

        // articleArray.push(result);
        // res.render("index", { quotes: data });
        res.send(results);
    })
    .catch(function (err) {
        // If an error occurred, send it to the client
        console.log(err);
        return res.json(err);

    });

});


// Route for getting all Articles from the db
app.get("/article", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
            _id: req.params.id
        })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});