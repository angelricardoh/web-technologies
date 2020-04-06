const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const port = process.env.PORT || 8080;
const app = express();
var cors = require("cors");

const GUARDIAN_API_KEY = "4e22f01e-35ce-4b12-ad57-1a7f8116ee21";
const NY_TIMES_API_KEY = "nCfLNNY4zJ67wfSTpiLm8RxxdpLmJ5mL";

app.use(cors());
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "public")));

function getGuardianArticles(req) {
  return new Promise(resolve => {
    let section = req.query.section;
    if (section !== "home") {
      fetch(
        "https://content.guardianapis.com/" +
          section +
          "?api-key=" +
          GUARDIAN_API_KEY +
          "&show-blocks=all"
      )
        .then(response => response.json())
        .then(
          data => {
            resolve(data);
          },
          error => {
            throw error;
          }
        );
    } else {
      fetch(
        "https://content.guardianapis.com/search?api-key=" +
          GUARDIAN_API_KEY +
          "&section=(sport|business|technology|politics)&show-blocks=all&page-size=20"
      )
        .then(response => response.json())
        .then(
          data => {
            resolve(data);
          },
          error => {
            throw error;
          }
        );
    }
  });
}

function getNYTimesArticles(req) {
  return new Promise(resolve => {
    let section = req.query.section;
    fetch(
      "https://api.nytimes.com/svc/topstories/v2/" +
        section +
        ".json?api-key=" +
        NY_TIMES_API_KEY
    )
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
    if (source === "guardian") {
      fetch(
        "https://content.guardianapis.com/" +
          articleId +
          "?api-key=" +
          GUARDIAN_API_KEY +
          "&show-blocks=all"
      )
        .then(response => response.json())
        .then(
          data => {
            resolve(data);
          },
          error => {
            throw error;
          }
        );
    } else {
      let url =
        'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("';
      url += articleId;
      url += '")&api-key=';
      url += NY_TIMES_API_KEY;
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
    }
  });
}

// GET response for The Guardian news
app.get("/guardian_news", async function(req, res) {
  try {
    let section = req.query.section;
    let wrappedResponse = await getGuardianArticles(req);
    let response = wrappedResponse.response;
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

    // if (section !== "home") {
    //   articles = articles.slice(0, 10)
    // }

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
app.get("/nytimes_news", async function(req, res) {
  try {
    let section = req.query.section;
    let response = await getNYTimesArticles(req);
    let articles = [];

    for (let index in response.results) {
      let currentResult = response.results[index];

      let title = currentResult.title;

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

      let section = currentResult.section;

      let dateString = currentResult.published_date;
      let date = formatShortDate(new Date(dateString));

      let description = currentResult.abstract;

      let shareUrl = currentResult.url;
      let id = currentResult.url;

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
app.get("/article_detail", async function(req, res) {
  try {
    let detail = null;

    let wrappedResponse = await getArticleDetail(req);
    let source = req.query.source;
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

      let shareUrl = content.webUrl;

      detail = {
        title: title,
        image: image,
        date: date,
        description: description,
        shareUrl: shareUrl
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

      let shareUrl = docs.web_url;

      detail = {
        title: title,
        image: image,
        date: date,
        description: description,
        shareUrl: shareUrl
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

app.listen(port);
