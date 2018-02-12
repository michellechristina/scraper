var express = require("express");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var request = require("request");

var router = require("./control/router");
var exphbs  = require('express-handlebars');



var PORT = 3000;




// Initialize Express
var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views/'));

 // handlebars
 app.engine('handlebars', exphbs({defaultLayout: 'main'}));
 app.set('view engine', 'handlebars');
  


// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraper", {
//   useMongoClient: true
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


  
 
app.use("/", router);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
