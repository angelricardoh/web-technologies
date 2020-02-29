from flask import Flask, jsonify, request
from newsapi import NewsApiClient
import json

app = Flask(__name__)
newsapi = NewsApiClient(api_key='f020b671fc534b77b9cd0976b0fbdeb8')
top_headlines = newsapi.get_top_headlines(sources='cnn,fox-news', page_size=30)


# Init

# # /v2/top-headlines
# top_headlines = newsapi.get_top_headlines(q='bitcoin',
#                                           sources='bbc-news,the-verge',
#                                           category='business',
#                                           language='en',
#                                           country='us')

@app.route('/')
@app.route('/index')
def index():
    return app.send_static_file("index.html")


@app.route('/news', methods=['GET'])
def news():
    print(top_headlines)
    return jsonify(top_headlines["articles"])


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
    result = newsapi.get_everything(q=keyword, sources=sources,
                                    from_param=from_date, to=to_date, language='en', sort_by='relevancy', page_size=30)

    return jsonify(result)


if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.
    app.debug = True
    app.run()

