#!/bin/sh
#This script caches the news and event feeds from the UoP news website

#Update WEB_FOLDER if the cron job is not run from the MyPort root folder e.g. /var/www
WEB_FOLDER="../dest"
FEEDS_FOLDER=$WEB_FOLDER"/feeds"

NEWS_URL="http://uopnews.port.ac.uk/api/core/get_category_posts/?slug=students"
EVENTS_URL="http://uopnews.port.ac.uk/api/get_posts/?post_type=student_events&orderby=meta_value&order=desc&meta_key=eventdate&count=20"
PARTICIPANTS_URL="http://uopnews.port.ac.uk/api/core/get_category_posts/?slug=seeking-participants"

wget $NEWS_URL -O $FEEDS_FOLDER/uop-news.json
wget $EVENTS_URL -O $FEEDS_FOLDER/uop-events.json
wget $PARTICIPANTS_URL -O $FEEDS_FOLDER/uop-participants.json