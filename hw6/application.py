from flask import Flask, jsonify, request
from newsapi import NewsApiClient
import os.path
from os import path
from flask import current_app


app = Flask(__name__)
newsapi = NewsApiClient(api_key='f020b671fc534b77b9cd0976b0fbdeb8')
stop_words = []


@app.route('/')
@app.route('/index')
def index():
    with current_app.open_resource('static/stopwords_en.txt') as input_f:
        for line in input_f.readlines():
            stop_words.append(line.rstrip().decode("utf-8"))
        input_f.close()

    return app.send_static_file("index.html")


@app.route('/news', methods=['GET'])
def news():
    try:
        top_headlines = newsapi.get_top_headlines(sources='cnn,fox-news', page_size=30)
    except:
        return "Error server"
    articles = top_headlines["articles"]
    titles_words_dict = {}
    for article in articles:
        title = article["title"]
        title_words = title.split()
        for title_word in title_words:
            if title_word.lower() in stop_words: continue
            if title_word in titles_words_dict:
                titles_words_dict[title_word] += 1
            else:
                titles_words_dict[title_word] = 1
    top_words_list = sorted(titles_words_dict.items(), key=lambda x: x[1], reverse=True)
    top_words = [a_tuple[0] for a_tuple in top_words_list]

    top_headlines["top_words"] = top_words[0:30]
    return jsonify(top_headlines)


@app.route('/search', methods=['GET'])
def search():
    args = request.args
    keyword = ''
    keyword = ''
    from_date = ''
    to_date = ''
    category = ''
    sources = ''

    if "q" in args:
        keyword = args["q"]

    if "from" in args:
        from_date = args.get("from")

    if "to" in args:
        to_date = args["to"]

    if "category" in args:
        category = args["category"]

    if "sources" in args:
        sources = args["sources"]

    # jsonify(top_headlines)
    # parse_json = json.loads(top_headlines)
    try:
        result = newsapi.get_everything(q=keyword, sources=sources,
                                        from_param=from_date, to=to_date, language='en', sort_by='relevancy', page_size=30)
    except:
        return "Error server"
    return jsonify(result)


if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    app.debug = True
    app.run()

