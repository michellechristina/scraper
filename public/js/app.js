// save an article
$(".saveMe").on("click", function () {
    console.log("trying to save")
    const article = {};
    article.headline = $(this).attr("data-headline");
    article.summary = $(this).attr("data-summary");
    article.url = $(this).attr("data-url");

    $.ajax({
        method: "POST",
        url: "/save",
        data: article
    }).then(function (data) {
        // Log the response
        console.log("data");
        console.log(data);
    });
});


// Get Notes
$(".addComment").on("click", function () {
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    // console.log("THIS ID")
    // console.log(thisId);

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
        });

});



// When you click the save comment button
$(".saveComment").on("click", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    var comment = $(this).parent().parent().find(".commentInput").val();
    console.log("THIS COMMENT");
    console.log(comment);

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from note textarea
                // body: $(".commentInput").val()
                body: comment
            }
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log("data");
            console.log(data);
            // reload the page, so that you can see new comments add to modal
            location.reload();
            // Empty the notes section
            // $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#commentInput").val("");

});

$(".deleteButton").on("click", function (event) {
    var thisId = $(this).attr("data-id");

    // Send the DELETE request.
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "DELETE",
        url: "/comments/" + thisId
    }).then(
        function () {
            console.log("deleted id ", thisId);
            // Reload the page to get the updated list
            location.reload();
        }
    );
});


///////////////////////////////////////////
// this is the background color randomizer
function getRandomColor() {
    var letters = '789ABCD';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
    }
    return color;
}


/// background color randomized for everything with colorize class
$(document).ready(function () {
    $('.colorize').each(function () {
        $(this).css('background', getRandomColor());
    });
});