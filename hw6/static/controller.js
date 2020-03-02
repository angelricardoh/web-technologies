let base_url = 'http://127.0.0.1:5000/';

window.onload = function() {
    // xmlhttp = new XMLHttpRequest();
    // let headlines_request_url = base_url + 'news';
    // // console.log(headlines_request_url);
    // xmlhttp.open("GET",headlines_request_url,false);
    // xmlhttp.send();
    // var response = JSON.parse(xmlhttp.responseText);
    // console.log(response);
    // document.getElementById('headers').innerHTML= response;
}

function search() {
    // document.getElementById('headers').innerHTML= "Something else";
}

function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  // for (i = 0; i < tabcontent.length; i++) {
  //   tabcontent[i].style.display = "none";
  // }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the link that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}