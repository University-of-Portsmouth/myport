$( document ).ready(function() {

    var popularTopicsApiEndpoint = "https://restapi-portsmouth.kb.net/API/Article/HotTopics?PortalID=4&ClientID=12&TopCount=6&DateRange=15&ApiKey=E5p%2FZwD5SrqFPKFB7R2i74hCGNYkr478uWqdbZMujNI%3D&_=1485011710732";

    /**
     * Clear the default popular topics
     */
    var clearPopularTopics = function() {
        $('#popular-topics-1').empty();
        $('#popular-topics-2').empty();
    };

    /**
     * Generate the quick link
     * @param articleName
     * @param articleId
     * @returns {string}
     */
    var generateLink = function(articleName, articleId) {
        return '<li class="quick-link"><a href="https://kb.myport.ac.uk/Article/Index/12/4?id=' + articleId + '" target="_blank" role="link">' + articleName + '</a></li>';
    };

    var getPopularTopics = function() {
        $.get(popularTopicsApiEndpoint, function(popularTopics) {
            clearPopularTopics();
            //Sort the articles by the number of characters in their name (prevents uneven columns)
            popularTopics.sort(function (a, b) {
                return a.ArticleName.length - b.ArticleName.length;
            });

            for(var i = 0; i < popularTopics.length; i++) {
                var article = popularTopics[i];
                var linkHtml = generateLink(article.ArticleName, article.ArticleID);
                //Separate the links into two columns
                if (i % 2 == 0) {
                    $('#popular-topics-1').append(linkHtml);
                } else {
                    $('#popular-topics-2').append(linkHtml);
                }
            }
        }).fail(function() {
            //No need to handle fail because the default popular topics remain
        });
    };

    getPopularTopics();

});