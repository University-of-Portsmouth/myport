$( document ).ready(function() {

    /**
     * The calendar months
     * @type {string[]}
     */
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    /**
     * Add leading zero to dates
     * @param n
     * @returns {string}
     */
    var addLeadingZero = function(n) {
        return (n < 10) ? ("0" + n) : n;
    }

    /**
     * Display a news feed item
     *
     * @param title
     * @param thumbnail
     * @param date
     * @param displayNewsItem
     */
    var displayNewsItem = function(title, thumbnail, date, displayNewsItem) {
        var newsItem = '<a href="' + displayNewsItem + '" class="media" target="_blank"><div class="media-left">';
        newsItem += '<img class="media-object" aria-hidden="true" src="' + thumbnail + '" alt="' + title + '"></div><div class="media-body">';
        newsItem += '<h4 class="media-heading">' + title + '</h4>';
        newsItem += '<p class="media-date">' + date + '</p></div></a>';

        $('#panel-news').append(newsItem);
    };

    /**
     * Display an event item
     *
     * @param title
     * @param location
     * @param date
     * @param link
     */
    var displayEventItem = function(title, location, date, link) {
        var eventItem = '<a href="' + link + '" class="media" target="_blank"><div class="media-body">';
        eventItem += '<h4 class="media-heading">' + title + '</h4>';
        eventItem += '<p class="media-date">' + date + '</p>';
        eventItem += '<p class="media-location">' + location + '</p></div></a>';

        $('#panel-events').append(eventItem);
    };

    /**
     * Display a seeking participants item
     *
     * @param title
     * @param department
     * @param thumbnail
     * @param link
     */
    var displayParticipants = function(title, department, thumbnail, link) {
        var opportunityItem = '<a href="' + link + '" class="media" target="_blank"><div class="media-left">';
        opportunityItem += '<img class="media-object" aria-hidden="true" src="' + thumbnail + '" alt="' + title + '"></div><div class="media-body">';
        opportunityItem += '<h4 class="media-heading">' + title + '</h4>';
        opportunityItem += '<p class="media-date">' + department + '</p></div></a>';

        $('#panel-participants').append(opportunityItem);
    };

    /**
     * Get the news feed
     */
    var getNewsFeed = function() {
        $.get('/feeds/uop-news.json', function(newsFeed) {
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
        }).fail(function() {
            $('#panel-news').empty().append('Error loading feed');
        });
    };

    /**
     * Get the events feed
     */
    var getEventsFeeds = function() {
        $.get('/feeds/uop-events.json', function(eventsFeeds) {
            $('#panel-events').empty();
            var topEvents = eventsFeeds.posts.slice(0, 3);
            for(var i = 0; i < topEvents.length; i++){
                var topEvent = topEvents[i];

                var title = topEvent.title;

                var location = topEvent.custom_fields.eventvenue;
                if (location.length > 0) {
                    location = location[0];
                } else {
                    location = '';
                }

                var startDate = topEvent.custom_fields.eventdate[0].split(/[- :]/);
                startDate = new Date(Date.UTC(startDate[0], startDate[1]-1, startDate[2], startDate[3], startDate[4]));
                var endDate = topEvent.custom_fields.eventdateend[0].split(/[- :]/);
                endDate = new Date(Date.UTC(endDate[0], endDate[1]-1, endDate[2], endDate[3], endDate[4]));

                var dateString = '';

                //If on the event is on a single day
                if (startDate.getUTCDate() == endDate.getUTCDate() && startDate.getMonth() == endDate.getMonth()) {
                    dateString = startDate.getUTCDate() + " " + monthNames[startDate.getMonth()] + " " + startDate.getFullYear() +
                        " - " + addLeadingZero(startDate.getUTCHours()) + ":" + addLeadingZero(startDate.getMinutes()) + " until " +
                        addLeadingZero(endDate.getUTCHours()) + ":" + addLeadingZero(endDate.getMinutes());
                } else {
                    dateString = startDate.getUTCDate() + " " + monthNames[startDate.getMonth()] + " " + startDate.getFullYear() +
                        " - " + addLeadingZero(startDate.getUTCHours()) + ":" + addLeadingZero(startDate.getMinutes()) + " until </br>" +
                        endDate.getUTCDate() + " " + monthNames[endDate.getMonth()] + " " + endDate.getFullYear() + " - " +
                        addLeadingZero(endDate.getUTCHours()) + ":" + addLeadingZero(endDate.getMinutes());
                }

                var url = topEvent.url;

                displayEventItem(title, location, dateString, url);
            }
        }).fail(function() {
            $('#panel-events').empty().append('Error loading feed');
        });
    };

    /**
     * Get the participants needed feed
     */
    var getParticipantsFeed = function() {
        $.get('/feeds/uop-participants.json', function(participantsFeed) {
            $('#panel-participants').empty();
            var topOpportunities = participantsFeed.posts.slice(0, 3);
            for(var i = 0; i < topOpportunities.length; i++){
                var opportunity = topOpportunities[i];
                var title = opportunity.title;

                var department = '';
                if (opportunity.custom_fields.customdepartment.length > 0) {
                    department = opportunity.custom_fields.customdepartment[0];
                }

                var thumbnail = opportunity.thumbnail_images.medium.url;

                //Use a placeholder thumbnail if none exists
                if (thumbnail == '' || thumbnail === undefined) {
                    thumbnail = '/images/placeholder/news.png';
                }

                var url = opportunity.url;
                displayParticipants(title, department, thumbnail, url);
            }
        }).fail(function() {
            $('#panel-participants').empty().append('Error loading feed');
        });
    };

    //Get the feeds
    getNewsFeed();
    getEventsFeeds();
    getParticipantsFeed();
});