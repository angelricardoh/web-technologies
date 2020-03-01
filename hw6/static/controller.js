let base_url = 'http://127.0.0.1:5000/';
window.onload = function() {
    xmlhttp = new XMLHttpRequest();
    let headlines_request_url = base_url + 'news';
    console.log(headlines_request_url);
    xmlhttp.open("GET",headlines_request_url,false);
    xmlhttp.send();
    var response = JSON.parse(xmlhttp.responseText);
    console.log(response);
    document.getElementById('headers').innerHTML= response;
}

function search() {
    document.getElementById('headers').innerHTML= "Something else";
}