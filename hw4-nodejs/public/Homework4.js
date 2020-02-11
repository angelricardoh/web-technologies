var html_text;
const rank_index_const = 0;
const name_index_const = 1;
const city_index_const = 2;
const height_index_const = 3;
const wikipage_index_const = 4;
const image_index_const = 5;

function viewJSON(what) {
    var URL = what.URL.value;
    var hWin;
    var jsonObj = loadJSON(URL);
    jsonObj.onload=generateHTML(jsonObj);
    if (jsonObj === 'undefined') {
        return
    }

    // hWin = window.open("", "Assignment4", "height=800,width=600");
    hWin = window.open('', '_blank', 'toolbar=0,location=0,menubar=0');
    hWin.document.write(html_text);
    hWin.document.close();
}

function loadJSON(url) {
    var xmlhttpRequest, jsonObj;
    try {
        xmlhttpRequest=new XMLHttpRequest();
        xmlhttpRequest.open("GET",url,false); // "synchronous” (deprecated because it freezes the page while waiting for a response) *
        xmlhttpRequest.send();
        jsonObj= JSON.parse(xmlhttpRequest.responseText);
        if(isEmpty(jsonObj)) {
            alert("Json Object is empty");
            return;
        }
        if (typeof(jsonObj.Mainline.Table.Row)==='undefined' || jsonObj.Mainline.Table.Row.length == 0) {
            alert("No data")
            return;
        }
        return jsonObj;
    }
    catch (exception)
    {
        alert("File does not exist!");
    }
}

function generateHTML(jsonObj) {
    var root = jsonObj.DocumentElement;
    html_text = "<html><head><title>JSON Parse Result</title></head><body>";
    html_text += "<table border='2'>";
    var buildings_headers = jsonObj.Mainline.Table.Header.Data; // an array of planes
    html_text += "<tbody>";
    html_text += "<tr>";
    var x = 0,
        y = 0;
    // output the headers
    for (var i = 0; i < buildings_headers.length; i++) {
        var header = buildings_headers[i];
        switch (header, i) {
            case "Rank", "Rank of building", rank_index_const:
                header = "Rank"
                x = 120;
                y = 55;
                break;

            case "Name", "Name of Building", name_index_const:
                header = "Name"
                break;

            case "City / Country", "Location Info", city_index_const:
                header = "City / Country"
                break;

            case "Height (ft)", "Feet", height_index_const:
                header = "Height (ft)"
                break;

            case "Wiki Page", "Wikipedia Page", wikipage_index_const:
                header = "Wiki Page"
                break;

            case "Image", "Logo", image_index_const:
                header = "Image"
                break;
        }
        html_text += "<th>" + header + "</th>";
    }
    html_text += "</tr>";
    var buildings = jsonObj.Mainline.Table.Row
    // output out the values
    for (i = 0; i < buildings.length; i++) //do for all planes (one per row)
    {
        buildingsNodeList = buildings[i]; //get properties of a plane (an object)
        html_text += "<tr>"; //start a new row of the output table
        var buildings_keys = Object.keys(buildingsNodeList);
        for (var j = 0; j < buildings_keys.length; j++) {
            var prop = buildings_keys[j];
            switch (prop, j) {
                case "City / Country", "Location Info", city_index_const:
                    let hubs = buildingsNodeList[prop].Hub
                    html_text += "<td><ul>"
                    for (var k = 0; k < hubs.length; k++) {
                        if (k == 0) {
                            html_text += "<li><b>" + hubs[k] + "</b></li>";
                        } else {
                            html_text += "<li>" + hubs[k] + "</li>";
                        }
                    }
                    html_text += "</ul></td>"

                    break;

                case "Wiki Page", "Wikipedia Page", wikipage_index_const:
                    html_text += "<td><a href='" + buildingsNodeList[prop] + "'>" + buildingsNodeList[prop] + "</td>";
                    break;

                case "Image", "Logo", image_index_const:
                    //handle images separately
                    html_text += "<td><img src='" + buildingsNodeList[prop] + "' width='" + 160 + "' height='" + 160 + "'></td>";
                    break;

                default:
                    html_text += "<td>" + buildingsNodeList[prop] + "</td>";
                    break;
            }
        }
        html_text += "</tr>";
    }
    html_text += "</tbody>";
    html_text += "</table>";
    html_text += "</bo" + "<dy> </html>";
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}