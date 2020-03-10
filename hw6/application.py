from flask import Flask, jsonify, request
from newsapi import NewsApiClient
import os.path
from os import path
from flask import current_app
import re

from newsapi.newsapi_exception import NewsAPIException

application = Flask(__name__)
newsapi = NewsApiClient(api_key='f020b671fc534b77b9cd0976b0fbdeb8')
# Test key
# newsapi = NewsApiClient(api_key='1262ddcc23a545bfb423113072b8fc60')


@application.route('/')
@application.route('/index')
def index():
    return application.send_static_file("index.html")


@application.route('/news', methods=['GET'])
def news():
    stop_words = []
    with current_app.open_resource('static/stopwords_en.txt') as input_f:
        for line in input_f.readlines():
            stop_words.append(line.rstrip().decode("utf-8"))
    input_f.close()

    try:
        top_headlines = newsapi.get_top_headlines(sources='cnn,fox-news', page_size=30)
        carousel_headlines = newsapi.get_top_headlines(country='us', page_size=30)

        articles = top_headlines["articles"]
        titles_words_dict = {}
        for article in articles:
            title = article["title"]
            title_words = title.split()
            for title_word in title_words:
                title_word = re.sub('[^0-9a-zA-Z]+', '', title_word)
                if title_word.lower() in stop_words or len(title_word) == 0: continue
                if titles_words_dict.get(title_word.capitalize()):
                    title_word = title_word.capitalize()
                elif titles_words_dict.get(title_word.lower()):
                    title_word = title_word.lower()
                if title_word in titles_words_dict:
                    titles_words_dict[title_word] += 1
                else:
                    titles_words_dict[title_word] = 1
        # TODO: Merge duplicated words with different case. Right now only first word is store no matter which case is using.

        top_words_list = sorted(titles_words_dict.items(), key=lambda x: x[1], reverse=True)
        # # top_words_dict =
        # top_words = [a_tuple[0] for a_tuple in top_words_list]

        top_headlines["top_words"] = top_words_list[0:30]
        top_headlines["articles"] = filter_valid_articles(top_headlines["articles"])
        top_headlines["carousel_articles"] = filter_valid_articles(carousel_headlines["articles"])
    except NewsAPIException as e:
        return e.get_message(), 500
    except:
        response = jsonify("Error server while retrieving headlines")
        response.status_code = 500
        return response
    return jsonify(top_headlines)


@application.route('/sources', methods=['GET'])
def sources():
    args = request.args

    try:
        category = args['category']
        if category and category != 'all':
            sources_response = newsapi.get_sources(category=category,
                                                   language='en',
                                                   country='us')
        else:
            sources_response = newsapi.get_sources(language='en',
                                                   country='us')
        all_sources_list = sources_response["sources"]
    except NewsAPIException as e:
        return e.get_message(), 500
    except:
        response = jsonify("Error server while retrieving sources")
        response.status_code = 500
        return response
    if category is None or category == '' or category == 'all':
        return jsonify(all_sources_list)
    return jsonify(all_sources_list[0:10])


def filter_valid_articles(articles):
    valid_articles = []
    for article in articles:
        author = article["author"]
        title = article["title"]
        description = article["description"]
        url = article["url"]
        url_to_image = article["urlToImage"]
        published_at = article["publishedAt"]
        source = article["source"]
        source_id = source["id"]
        source_name = source["name"]

        if author is None or len(author) == 0 or author == 'null' or \
                title is None or len(title) == 0 or title == 'null' or \
                description is None or len(description) == 0 or description == 'null' or \
                url is None or len(url) == 0 or url == 'null' or \
                url_to_image is None or len(url_to_image) == 0 or url_to_image == 'null' or \
                published_at is None or len(published_at) == 0 or published_at == 'null' or \
                source is None or \
                source_id is None or len(source_id) == 0 or source_id == 'null' or \
                source_name is None or len(source_name) == 0 or source_name == 'null':
            continue
        else:
            valid_articles.append(article)
    return valid_articles


@application.route('/search', methods=['GET', 'POST'])
def search():
    result = None
    keyword = ''
    from_date = ''
    to_date = ''
    sources = ''

    if request.args:
        args = request.args

        if "keyword" in args:
            keyword = args["keyword"]

        if "from" in args:
            from_date = args.get("from")

        if "to" in args:
            to_date = args["to"]

        if "source" in args:
            sources = args["source"]

    try:
        result = newsapi.get_everything(q=keyword,
                                        from_param=from_date,
                                        to=to_date,
                                        sources=sources,
                                        language='en',
                                        sort_by='publishedAt',
                                        page_size=30)
        result = filter_valid_articles(result["articles"])
    except NewsAPIException as e:
        return e.get_message(), 500
    except:
        response = jsonify("Error server while retrieving search")
        response.status_code = 500
        return response
    return jsonify(result[0:10])


if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    application.debug = True
    application.run()
