let base_url = 'http://127.0.0.1:5000/';

window.onload = function() {
    xmlhttp = new XMLHttpRequest();
    let headlines_request_url = base_url + 'news';
    // console.log(headlines_request_url);
    xmlhttp.open("GET",headlines_request_url,true);
    xmlhttp.onload = function (e) {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
            jsonObj = JSON.parse(xmlhttp.responseText);
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

function selectMenuOption(evt, cityName) {
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
  document.getElementById(cityName).style.display = "block";
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

    document.getElementById("headers").appendChild(div_news_container);
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