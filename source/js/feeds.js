$( document ).ready(function() {
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    /**
     * Display a news feed item
     *
     * @param title
     * @param thumbnail
     * @param date
     * @param displayNewsItem
     */
    var displayNewsItem = function(title, thumbnail, date, displayNewsItem) {
        var newsItem = '<a href="' + displayNewsItem + '" class="media"><div class="media-left">';
        newsItem += '<img class="media-object" src="' + thumbnail + '" alt="' + title + '"></div><div class="media-body">';
        newsItem += '<h4 class="media-heading">' + title + '</h4>';
        newsItem += '<p class="media-date">' + date + '</p></div></a>';

        $('#panel-news').append(newsItem);
    };

    /**
     * Get the news feed
     */
    var getNewsFeed = function() {
        $.get('/example-uop-news.json', function(newsFeed) {
            $('#panel-news').empty();
            var topNews = newsFeed.posts.slice(0, 3);
            for(var i = 0; i < topNews.length; i++){
                var newsItem = topNews[i];
                var title = newsItem.title;
                var thumbnail = newsItem.thumbnail_images.medium.url;

                //Use a placeholder thumbnail if none exists
                if (thumbnail == '' || thumbnail === undefined) {
                    thumbnail = '/images/placeholder/news.png';
                }

                var date = newsItem.date.split(/[- :]/);
                date = new Date(Date.UTC(date[0], date[1]-1, date[2], date[3], date[4], date[5]));
                var dateString = "Posted: " + date.getUTCDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
                var url = newsItem.url;
                displayNewsItem(title, thumbnail, dateString, url);
            }
        });
    };

    getNewsFeed();
});