let base_url = 'http://127.0.0.1:5000/';
var words_cloud = "";

window.onload = function() {
    xmlhttp = new XMLHttpRequest();
    let headlines_request_url = base_url + 'news';
    // console.log(headlines_request_url);
    xmlhttp.open("GET",headlines_request_url,true);
    xmlhttp.onload = function (e) {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
            jsonObj = JSON.parse(xmlhttp.responseText);
            top_words = jsonObj.top_words;
            top_words_array = [];
            for (top_words_index in top_words) {
                top_words_array.push(top_words[top_words_index]);
            }
            generateWordsCloudLayout(top_words_array);
            let validArticles = getValidArticles(jsonObj.articles);
            generateArticlesLayout(validArticles);
        } else {
          console.error(xmlhttp.statusText);
        }
      }
    };
    xmlhttp.onerror = function (e) {
        console.error(xhr.statusText);
    };
    xmlhttp.send();
}

function search() {
    // document.getElementById('headers').innerHTML= "Something else";
}

function selectMenuOption(menuOption) {
  // Declare all variables
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(menuOption).style.display = "block";
  evt.currentTarget.className += " active";
}

function getValidArticles(articles) {
    var valid_articles = [];
    for (let article_index in articles) {
        article = articles[article_index];
        author = article.author;
        title = article.title;
        description = article.description;
        url = article.url;
        urlToImage = article.urlToImage;
        publishedAt = article.publishedAt;
        source = article.source;

        if (author == null || author.length == 0 ||
            title == null || title.length == 0 ||
            description == null || description.length == 0 ||
            url == null || url.length == 0 ||
            urlToImage == null ||
            publishedAt == null || publishedAt.length == 0 ||
            source == null || source.id == null || source.id.length == 0 ||
            source.name == null || source.name.length == 0)
        {
            continue;
        } else {
            valid_articles.push(article);
        }
    }
    return valid_articles
}

function generateArticlesLayout(articles) {
    var cnn_articles = [];
    var fox_articles = [];

    for (let article_index in articles) {
        let article = articles[article_index];
        if (article.source.id == "fox-news") {
            if (fox_articles.length < 5) {
                fox_articles.push(article);
            }
        } else if (article.source.id == "cnn") {
            if (cnn_articles.length < 5) {
                cnn_articles.push(article);
            }
        }
        if (fox_articles.length == 5 && cnn_articles.length == 5) {
            break;
        }
    }

    var div_news_container = document.createElement("div");
    var top_headline_container = document.createElement("div");
    let cnn_news_container = createNewsContainer("CNN", cnn_articles);
    let fox_news_container = createNewsContainer("Fox News", fox_articles);

    div_news_container.appendChild(cnn_news_container);
    div_news_container.appendChild(fox_news_container);

    document.getElementById("top_news").appendChild(div_news_container);
}

function createNewsContainer(title, articles) {
    var news_container = document.createElement("div");
    news_container.classList.add("news_container");

    var title_element = document.createElement("p");
    title_element.textContent = title;
    var hr = document.createElement("hr");

    news_container.appendChild(title_element);
    news_container.appendChild(hr);

    for (let article_index in articles) {
        let article = articles[article_index];
        var card = document.createElement("div");
        card.classList.add("card");
        var image = document.createElement("img");
        image.src = article.urlToImage;
        var title_headline = document.createElement("p");
        var content_headline = document.createElement("p");
        title_headline.innerText = article.title;
        content_headline.innerText = article.description;
        console.log("title: " + title_headline);
        console.log("content: " + content_headline);

        card.appendChild(image);
        card.appendChild(title_headline);
        card.appendChild(content_headline);
        news_container.appendChild(card);
    }
    return news_container
}

function generateWordsCloudLayout(top_words){

var myWords = top_words.map(function(d) {
      return {word: d, size: 10 + Math.random() * 30};
    })
// var myWords = [{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#word_cloud").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
// Wordcloud features that are different from one word to the other must be here
var layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
  .padding(5)        //space between words
  .rotate(function() { return ~~(Math.random() * 2) * 90; })
  .fontSize(function(d) { return d.size; })      // font size of words
  .on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size; })
        .style("fill", "#69b3a2")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}
}