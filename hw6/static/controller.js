const base_url = 'http://127.0.0.1:5000/';
const CARD_LAYOUT_SIZE = 4;
const SLIDE_LAYOUT_SIZE = 5;

window.onload = function() {
    cleanSlides();
    let headlines_request_url = base_url + 'news';
    makeRequest(headlines_request_url, function (xmlhttpResponse) {
        jsonObj = JSON.parse(xmlhttpResponse);
        top_words = jsonObj.top_words;
        top_words_array = [];
        for (top_words_index in top_words) {
            top_words_array.push(top_words[top_words_index]);
        }
        carousel_articles = jsonObj.carousel_articles;
        generateCarouselLayout(carousel_articles.slice(0, SLIDE_LAYOUT_SIZE + 1));
        generateWordsCloudLayout(top_words_array);
        generateArticlesLayout(jsonObj.articles);
    },function (error) {
        alert(error);
    });
    retrieveSources();
    let form = document.getElementById( "form_search" );
    form.addEventListener( "submit", function ( event ) {
        event.preventDefault();
        search(form);
    });
}

function makeRequest(url, sucessBlock, errorBlock) {
    try {
        let xmlHttpRequest = new XMLHttpRequest();
        let headlines_request_url = base_url + 'news';
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.onload = function (e) {
            if (xmlHttpRequest.readyState === 4) {
                if (xmlHttpRequest.status === 200) {
                    sucessBlock(xmlHttpRequest.responseText);
                } else {
                    errorBlock(xmlHttpRequest.statusText)
                }
            } else {
              errorBlock(xmlHttpRequest.statusText);
            }
        };
        xmlHttpRequest.onerror = function (e) {
            errorBlock(xmlHttpRequest.statusText);
        };
        xmlHttpRequest.send();
    }
    catch (exception)
    {
        errorBlock("Unkwown error loading request " + exception.message);
    }
}

function search(searchForm) {
    let search_request_url = base_url + 'search?';
    let searchValuesDict = {};

    for (let i = 0; i < searchForm.length; i++) {
        searchValuesDict[searchForm.elements[i].name] = searchForm.elements[i].value;
    }
    for (let key in searchValuesDict) {
        if (key == "submit" || key == "clear") {
            continue;
        }
        search_request_url += key + "=" + searchValuesDict[key] + "&"
    }
    search_request_url = search_request_url.slice(0, -1);

    makeRequest(search_request_url, function (xmlhttpResponse) {
        let jsonObj = JSON.parse(xmlhttpResponse);
        generateSearchResultsLayout(jsonObj);
    },function (error) {
        alert(error);
    });
}

function selectMenuOption(menuOption) {
  let tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  let tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(menuOption).style.display = "block";
}

// pragma mark - Carousel

function cleanSlides() {
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < SLIDE_LAYOUT_SIZE; i++) {
        slides[i].style.display = "none";
    }
}

var slideIndex = 0;
function generateCarouselLayout(carousel_headlines) {
    let headlines = carousel_headlines;

    showSlides();
    function showSlides() {
        let slides = document.getElementsByClassName("mySlides");
        for (let i = 0; i < SLIDE_LAYOUT_SIZE; i++) {
            slides[i].style.display = "none";
        }
        slideIndex++;
        if (slideIndex > SLIDE_LAYOUT_SIZE) {slideIndex = 1}
        let currentSlide = slides[slideIndex-1];

        let currentSlideText = currentSlide.getElementsByClassName("mySlidesText")[0];
        let headlineTitle = currentSlideText.getElementsByClassName("headlineTitle")[0];
        let headlineDescription = currentSlideText.getElementsByClassName("headlineDescription")[0];
        let headlineImage = currentSlide.getElementsByClassName("imgSlide")[0];

        headlineTitle.innerText = headlines[slideIndex].title;
        headlineDescription.innerText = headlines[slideIndex].description;
        headlineImage.src = headlines[slideIndex].urlToImage;
        currentSlide.style.display = "block";
        currentSlide.onclick = function() {
            window.open(headlines[slideIndex].url);
        }
        setTimeout(showSlides, 2000); // Change image every 2 seconds
    }
}

// pragma mark - Words Cloud

function generateWordsCloudLayout(top_words){
    let myWords = top_words.map(function(d) {
          return {word: d, size: 10 + Math.random() * 30};
        })

    // set the dimensions and margins of the graph
    let margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 450 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    let svg = d3.select("#word_cloud").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    let layout = d3.layout.cloud()
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
        .style("font-size", function(d) { return d.size+ "px"; })
        .style("fill", "#000000")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    }
}

// pragma mark - News Layout

function generateArticlesLayout(articles) {
    let cnn_articles = [];
    let fox_articles = [];

    for (let article_index in articles) {
        let article = articles[article_index];
        if (article.source.id == "fox-news") {
            if (fox_articles.length < CARD_LAYOUT_SIZE) {
                fox_articles.push(article);
            }
        } else if (article.source.id == "cnn") {
            if (cnn_articles.length < CARD_LAYOUT_SIZE) {
                cnn_articles.push(article);
            }
        }
        if (fox_articles.length == CARD_LAYOUT_SIZE && cnn_articles.length == CARD_LAYOUT_SIZE) {
            break;
        }
    }

    let div_news_container = document.createElement("div");
    let top_headline_container = document.createElement("div");
    let cnn_news_container = createNewsContainer("CNN", cnn_articles);
    let fox_news_container = createNewsContainer("Fox News", fox_articles);

    div_news_container.appendChild(cnn_news_container);
    div_news_container.appendChild(fox_news_container);

    document.getElementById("top_news").appendChild(div_news_container);
}

function createNewsContainer(title, articles) {
    let news_container = document.createElement("div");
    news_container.classList.add("news_container");

    let title_element = document.createElement("h2");
    title_element.textContent = title;
    let hr = document.createElement("hr");

    news_container.appendChild(title_element);
    news_container.appendChild(hr);

    for (let article_index in articles) {
        let article = articles[article_index];
        let card = document.createElement("div");
        card.classList.add("card");
        card.onclick = function() {
            window.open(article.url);
        }
        let image = document.createElement("img");
        image.src = article.urlToImage;
        image.classList.add("card-img");
        let title_headline = document.createElement("p");
        let content_headline = document.createElement("p");
        title_headline.innerText = article.title;
        content_headline.innerText = article.description;

        card.appendChild(image);
        card.appendChild(title_headline);
        card.appendChild(content_headline);
        news_container.appendChild(card);
    }
    return news_container
}

// pragma mark - Sources

function retrieveSources(category='') {
    let sources_request_url = base_url + 'sources?category=' + category;

    makeRequest(sources_request_url, function (xmlhttpResponse) {
        let jsonObj = JSON.parse(xmlhttpResponse);
        fillSources(jsonObj);
    },function (error) {
        alert(error);
    });
}

function fillSources(sources){
    let sourcesHtmlElement = document.getElementById("sources");
    for (let i=sourcesHtmlElement.options.length-1; i>0; i--) {
        sourcesHtmlElement.options.remove(i);
    }
    for (let sourceIndex in sources) {
        let currentSource = sources[sourceIndex];
        let option = document.createElement("option");
        option.text = currentSource.name;
        sourcesHtmlElement.add(option);
    }
}

// pragma mark - Search Results

function generateSearchResultsLayout(articles) {
    let search_results_container = document.getElementById("search_results");
    let child = search_results_container.lastElementChild;
    while (child) {
        search_results_container.removeChild(child);
        child = search_results_container.lastElementChild;
    }

    for (let article_index in articles) {
        let article = articles[article_index];
        let card = document.createElement("div");
        card.classList.add("card-result");

        let cardContainer = document.createElement("div");
        cardContainer.classList.add("card-result-container");

        let image = document.createElement("img");
        image.src = article.urlToImage;
        cardContainer.appendChild(image);

        let textContainer = document.createElement("div");
        textContainer.classList.add("card-result-text-container");

        let title_headline = document.createElement("h4");
        title_headline.innerText = article.title;
        textContainer.appendChild(title_headline);

        let author_headline = document.createElement("p");
        author_headline.classList.add("card-result-expandable-element");
        author_headline.innerText = "Author" + article.author;
        textContainer.appendChild(author_headline);

        let source_headline = document.createElement("p");
        source_headline.classList.add("card-result-expandable-element");
        source_headline.innerText = article.source;
        textContainer.appendChild(source_headline);

        let date_headline = document.createElement("p");
        date_headline.classList.add("card-result-expandable-element");
        date_headline.innerText = article.date;
        textContainer.appendChild(date_headline);

        let description_headline = document.createElement("p");
        description_headline.classList.add("card-result-description");
        description_headline.innerText = article.description;
        textContainer.appendChild(description_headline);

        let url_headline = document.createElement("a");
        url_headline.classList.add("card-result-expandable-element");
        url_headline.innerText = "See Original Post";
        url_headline.href = article.url;
        textContainer.appendChild(url_headline);

        cardContainer.appendChild(textContainer);
        card.appendChild(cardContainer);

        let collapsableButton = document.createElement("button");
        collapsableButton.textContent = "X";
        collapsableButton.classList.add("collapsable-button");
        collapsableButton.style.display = 'none';
        card.appendChild(collapsableButton);
        collapsableButton.addEventListener("click", function() {
            collapseResult(card);
        });

        search_results_container.appendChild(card);

        // Get scrollHeight with full content
        let scrollHeight = card.scrollHeight;

        cardContainer.addEventListener("click", function() {
            expandResult(card, scrollHeight);
        });
        description_headline.classList.add("card-result-description-style");
        let expandableElements = textContainer.getElementsByClassName("card-result-expandable-element");
        for (let index = 0; index<expandableElements.length; index++) {
            expandableElements[index].style.display = 'none';
        }

        if (article_index >= 5) {
            card.style.display = 'none';
        }
    }

    if (articles.length > 5) {
        let showMoreLessButton = document.createElement("button");
        showMoreLessButton.textContent = "Show More";
        showMoreLessButton.value = "Show More";
        showMoreLessButton.onclick = function(){
            if (showMoreLessButton.value == "Show More") {
                for (let i = 5; i<articles.length; i++){
                    search_results_container.children[i].style.display = 'block';
                }
                showMoreLessButton.textContent = "Show Less";
                showMoreLessButton.value = "Show Less";
            } else {
                for (let i = 5; i<articles.length; i++){
                    search_results_container.children[i].style.display = 'none';
                }
                showMoreLessButton.textContent = "Show More";
                showMoreLessButton.value = "Show More";
            }
        }
        search_results_container.appendChild(showMoreLessButton);
    }
}

function collapseResult(card) {
    let cardContainer = card.getElementsByClassName("card-result-container")[0];
    let textContainer = cardContainer.getElementsByClassName("card-result-text-container")[0];
    let cardDescription = textContainer.getElementsByClassName("card-result-description")[0];
    cardDescription.classList.add("card-result-description-style");
    let expandableElements = textContainer.getElementsByClassName("card-result-expandable-element");
    for (let index = 0; index<expandableElements.length; index++) {
        expandableElements[index].style.display = 'none';
    }
    let collapsableButton = card.getElementsByClassName("collapsable-button")[0];
    collapsableButton.style.display = 'none';
    card.style.maxHeight = "100px";
}

function expandResult(card, scrollHeight) {
    let cardContainer = card.getElementsByClassName("card-result-container")[0];
    let textContainer = cardContainer.getElementsByClassName("card-result-text-container")[0];
    let cardDescription = textContainer.getElementsByClassName("card-result-description")[0];
    cardDescription.classList.remove("card-result-description-style");
    let expandableElements = textContainer.getElementsByClassName("card-result-expandable-element");
    for (let index = 0; index<expandableElements.length; index++) {
        expandableElements[index].style.display = 'block';
    }
    let collapsableButton = card.getElementsByClassName("collapsable-button")[0];
    collapsableButton.style.display = "block";
    card.style.maxHeight = scrollHeight + "px";
}
