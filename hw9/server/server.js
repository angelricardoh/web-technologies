const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const port = 8080;
const application = express();
const cors = require("cors");

const GUARDIAN_API_KEY = "4e22f01e-35ce-4b12-ad57-1a7f8116ee21";

application.use(cors());
application.use(express.static(__dirname));
application.use(express.static(path.join(__dirname, "public")));

function getGuardianMobileHomeArticles(req) {
  return new Promise(resolve => {
    let section = req.query.section;
    let url = "https://content.guardianapis.com/search?orderby=newest&show-" + 
      "fields=starRating,headline,thumbnail,short-url&api-key=" + GUARDIAN_API_KEY

    console.log("GET: " + url)

    fetch(url)
        .then(response => response.json())
        .then(
            data => {
              resolve(data);
            },
            error => {
              throw error;
            }
        );
  });
}

function getArticleDetail(req) {
  return new Promise(resolve => {
    let articleId = req.query.articleId;
    let url = "https://content.guardianapis.com/" + articleId + "?api-key=" + GUARDIAN_API_KEY + "&show-blocks=all"

    console.log("GET: " + url)

    fetch(url)
        .then(response => response.json())
        .then(
            data => {
              resolve(data);
            },
            error => {
              throw error;
            }
        );
  });
}

function getSearchResults(req) {
  return new Promise(resolve => {
    let search = req.query.search;
    let source = req.query.source;
    if (source !== 'guardian' && source !== 'nytimes') {
      throw Error('bad request')
    }
    let url = null
    if (source === "guardian") {
      url = "https://content.guardianapis.com/search?q=" +
          search +
          "&api-key=" +
          GUARDIAN_API_KEY +
          "&show-blocks=all"
    } else  {
      url =
          'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + search +
          '&api-key=' + NY_TIMES_API_KEY;

    }

    console.log("GET: " + url)

    fetch(url)
        .then(response => response.json())
        .then(
            data => {
              resolve(data);
            },
            error => {
              throw error;
            }
        );
  });
}

// GET response for The Guardian news
application.get("/article_detail", async function(req, res) {
  try {
    let detail = null;
    let source = req.query.source;

    let wrappedResponse = await getArticleDetail(req);
    let response = wrappedResponse.response;

    let content = response.content;

    let title = content.webTitle;

    let blocks = content.blocks;
    let main = blocks.main;
    let elements = main.elements;

    let image = "";
    if (typeof elements === "undefined" || elements[0].type !== "image") {
      image =
        "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
    } else {
      let assets = elements[0].assets;
      let lastIndexedAsset = assets.length - 1;
      image = assets[lastIndexedAsset].file;
      if (typeof image === "undefined" || image == null || image == "") {
        image =
          "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
      }
    }

    let dateString = content.webPublicationDate;

    Date.prototype.toLocaleFormat = function() {

      let month_names =["Jan","Feb","Mar",
                        "Apr","May","Jun",
                        "Jul","Aug","Sep",
                        "Oct","Nov","Dec"];
      
      
      let day = ("0" + date.getDate()).slice(-2);
      var month_index = this.getMonth();
      var year = this.getFullYear();
      
      return "" + day + " " + month_names[month_index] + " " + year;
    }
    let date = new Date(dateString);
    date = date.toLocaleFormat();

    let body = blocks.body[0];
    let description = body.bodyTextSummary;

    let section = content.sectionName

    let shareUrl = content.webUrl;

    detail = {
      title: title,
      image: image,
      date: date,
      description: description,
      shareUrl: shareUrl,
      section: section,
      source: source
    };

    let detail_json = {
      detail
    };

    res.status(200).send(detail_json);
  } catch (error) {
    console.log("Error while retrieving news from homepage API: " + error);
    res
      .status(500)
      .send("Error while retrieving news from homepage API: " + error);
  }
});

// GET response for search
application.get('/search', async function(req, res) {
  try {
    let source = req.query.source;
    if (typeof source === 'undefined' || source === null || source.length == 0) {
      throw Error('Bad request: Incorrect source value')
    }
    let articles = []
    let wrappedResponse = await getSearchResults(req)
    let response = wrappedResponse.response
    if (source === 'guardian') {
      articles = getGuardianArticlesData(response)
    } else if (source === 'nytimes') {
      articles = getNYTimesArticlesData(response)
    }

    let articles_json = {
      articles
    };
    res.status(200).send(articles_json);

    return wrappedResponse
  } catch (error) {
    console.log('Error while performing search: ' + error)
  }
});

// GET response for The Guardian news
application.get("/home_mobile_news", async function(req, res) {
  try {
    let wrappedResponse = await getGuardianMobileHomeArticles(req);
    let response = wrappedResponse.response;
    let articles = getGuardianMobileHomeArticlesData(response)

    let articles_json = {
      articles
    };

    res.status(200).send(articles_json);
  } catch (error) {
    console.log("Error while retrieving news from homepage API: " + error);
    res
      .status(500)
      .send("Error while retrieving news from homepage API: " + error);
  }
});

function getGuardianArticlesData(response) {
  let articles = [];

  for (let index in response.results) {
    let currentResult = response.results[index];
    let title = currentResult.webTitle;
    let id = currentResult.id;

    let blocks = currentResult.blocks;
    let main = blocks.main;
    if (typeof main === 'undefined'){
      continue
    }
    let elements = main.elements;
    let image = "";
    if (typeof elements === "undefined" || elements[0].type !== "image") {
      image =
          "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
    } else {
      let assets = elements[0].assets;
      let lastIndexedAsset = assets.length - 1;
      image = assets[lastIndexedAsset].file;
      if (typeof image === "undefined" || image == null || image == "") {
        image =
            "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
      }
    }

    let section = currentResult.sectionId;
    if (section === 'sport') {
      section = 'sports'
    }

    let dateString = currentResult.webPublicationDate;
    let date = formatShortDate(new Date(dateString));

    let shareUrl = currentResult.webUrl;

    let body = blocks.body[0];
    let description = body.bodyTextSummary;

    if (typeof id === 'undefined' || id === null || id.length == 0 ||
        typeof title === 'undefined' || title === null || title.length == 0 ||
        typeof image === 'undefined' || image === null || image.length == 0 ||
        typeof section === 'undefined' || section === null || section.length == 0 ||
        typeof date === 'undefined' || date === null || date.length == 0 ||
        typeof description === 'undefined' || description === null || description.length == 0 ||
        typeof shareUrl === 'undefined' || shareUrl === null || shareUrl.length == 0){
      continue
    }

    let article = {
      id: id,
      index: index,
      title: title,
      image: image,
      section: section,
      date: date,
      description: description,
      shareUrl: shareUrl
    };
    articles.push(article);
  }
  return articles
}

function getGuardianMobileHomeArticlesData(response) {
  let articles = [];

  for (let index in response.results) {
    let currentResult = response.results[index];
    let title = currentResult.webTitle;
    let id = currentResult.id;

    let section = currentResult.sectionName;
    // if (section === 'sport') {
    //   section = 'sports'
    // }

    let image = currentResult.fields.thumbnail;

    let dateString = currentResult.webPublicationDate;
    let date = timeSince(new Date(dateString));

    if (typeof id === 'undefined' || id === null || id.length == 0 ||
        typeof title === 'undefined' || title === null || title.length == 0 ||
        typeof image === 'undefined' || image === null || image.length == 0 ||
        typeof section === 'undefined' || section === null || section.length == 0 ||
        typeof date === 'undefined' || date === null || date.length == 0) {
      continue
    }

    let article = {
      id: id,
      title: title,
      image: image,
      section: section,
      date: date,
    };
    articles.push(article);
  }
  return articles
}

function formatShortDate(date, detail = false) {
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let dateSeparator = "-";
  return (
    date.getFullYear().toString() +
    dateSeparator +
    month.toString() +
    dateSeparator +
    day.toString()
  );
}

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);

  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + "h ago";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + "m ago";
  }
  return Math.floor(seconds) + "s ago";
}

application.listen(port);