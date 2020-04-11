const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const port = 8080;
const application = express();
const cors = require("cors");

const GUARDIAN_API_KEY = "4e22f01e-35ce-4b12-ad57-1a7f8116ee21";
const NY_TIMES_API_KEY = "nCfLNNY4zJ67wfSTpiLm8RxxdpLmJ5mL";

application.use(cors());
application.use(express.static(__dirname));
application.use(express.static(path.join(__dirname, "public")));

function getGuardianArticles(req) {
  return new Promise(resolve => {
    let section = req.query.section;
    let url = null
    if (section !== "home") {
      url =  "https://content.guardianapis.com/" + section + "?api-key=" + GUARDIAN_API_KEY + "&show-blocks=all"
    } else {
      url = "https://content.guardianapis.com/search?api-key=" + GUARDIAN_API_KEY +
          "&section=(sport|business|technology|politics)&show-blocks=all&page-size=20"
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

function getNYTimesArticles(req) {
  return new Promise(resolve => {
    let section = req.query.section;
    let url = "https://api.nytimes.com/svc/topstories/v2/" +
        section +
        ".json?api-key=" +
        NY_TIMES_API_KEY

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
    let source = req.query.source;
    if (source !== 'guardian' && source !== 'nytimes') {
      throw Error('bad request')
    }
    let url = null
    if (source === "guardian") {
      url = "https://content.guardianapis.com/" + articleId + "?api-key=" + GUARDIAN_API_KEY + "&show-blocks=all"
    } else {
      url =
          'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("';
      url += articleId;
      url += '")&api-key=';
      url += NY_TIMES_API_KEY;
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
application.get("/guardian_news", async function(req, res) {
  try {
    let section = req.query.section
    if (typeof section === 'undefined' || section === null || section.length == 0) {
      throw Error('Bad request: Incorrect section value')
    }
    let wrappedResponse = await getGuardianArticles(req);
    let response = wrappedResponse.response;
    let articles = getGuardianArticlesData(response)

    if (section !== "home") {
      articles = articles.slice(0, 10)
    }

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

// GET response for NY Times news
application.get("/nytimes_news", async function(req, res) {
  try {
    let section = req.query.section;
    if (typeof section === 'undefined' || section === null || section.length == 0) {
      throw Error('Bad request: Incorrect section value')
    }
    let response = await getNYTimesArticles(req);
    let articles = getNYTimesArticlesData(response)

    if (section !== "home") {
      articles = articles.slice(0, 10)
    }

    let articles_json = {
      articles
    };

    res.status(200).json(articles_json);
  } catch (error) {
    console.log("Error while retrieving news from homepage API: " + error);
    res
      .status(500)
      .send("Error while retrieving news from homepage API: " + error);
  }
});

// GET response for The Guardian news
application.get("/article_detail", async function(req, res) {
  try {
    let detail = null;
    let source = req.query.source;

    let wrappedResponse = await getArticleDetail(req);
    if (source === "guardian") {
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
      let date = formatShortDate(new Date(dateString));

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
    } else {
      // nytimes

      let response = wrappedResponse.response;

      let docs = response.docs[0];
      let headline = docs.headline;
      let title = headline.main;

      let image = "";
      let multimedia = docs.multimedia;
      for (let multimediaIndex in multimedia) {
        let currentMultimediaItem = multimedia[multimediaIndex];
        if (currentMultimediaItem.width >= 2000) {
          image = currentMultimediaItem.url;
          break;
        }
      }
      if (typeof image === "undefined" || image == null || image == "") {
        image =
          "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
      }

      let dateString = docs.pub_date;
      let date = formatShortDate(new Date(dateString), detail=true);

      let description = docs.abstract;

      let section = docs.section_name

      let shareUrl = docs.web_url;

      detail = {
        title: title,
        image: image,
        date: date,
        description: description,
        shareUrl: shareUrl,
        section: section,
        source: source
      };
    }

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

function getGuardianArticlesData(response) {
  let articles = [];

  for (let index in response.results) {
    let currentResult = response.results[index];
    let title = currentResult.webTitle;
    let id = currentResult.id;

    let blocks = currentResult.blocks;
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

    let section = currentResult.sectionId;

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

function getNYTimesArticlesData(response) {
  let articles = [];

  let results = typeof response.results !== 'undefined' ? response.results : response.docs

  for (let index in results) {
    let currentResult = results[index];

    let title = typeof currentResult.title !== 'undefined' ? currentResult.title : currentResult.headline.main;

    let image = "";
    let multimedia = currentResult.multimedia;
    for (let multimediaIndex in multimedia) {
      let currentMultimediaItem = multimedia[multimediaIndex];
      if (currentMultimediaItem.width >= 2000) {
        image = currentMultimediaItem.url;
        break;
      }
    }
    if (typeof image === "undefined" || image == null || image == "") {
      image =
          "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
    }

    let section = typeof currentResult.section !== 'undefined' ? currentResult.section : currentResult.news_desk
    // Special case politics category
    if (typeof currentResult.subsection !== 'undefined' && currentResult.subsection === 'politics') {
      section = 'politics'
    }

    let dateString = typeof currentResult.published_date !== 'undefined' ?
        currentResult.published_date : currentResult.pub_date
    let date = formatShortDate(new Date(dateString));

    let description = currentResult.abstract;

    let shareUrl = typeof currentResult.url !== 'undefined' ? currentResult.url : currentResult.web_url;
    let id = shareUrl;

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

function formatShortDate(date, detail = false) {
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let dateSeparator = detail ? "-" : "/";
  return (
    date.getFullYear().toString() +
    dateSeparator +
    month.toString() +
    dateSeparator +
    day.toString()
  );
}

application.listen(port);
