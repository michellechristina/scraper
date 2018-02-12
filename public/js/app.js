// save an article
$(".saveMe").on("click", function() {
    console.log("trying to save")
    const article = {};
    article.headline = $(this).attr("data-headline");
    article.summary = $(this).attr("data-summary");
    article.url = $(this).attr("data-url");

//     console.log("here");
// console.log(article);

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

