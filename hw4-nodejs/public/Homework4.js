var html_text;
let rank_index_const = 0;
let name_index_const = 1;
let city_index_const = 2;
let height_index_const = 3;
let wikipage_index_const = 4;
let image_index_const = 5;

function viewJSON(what) {
    var URL = what.URL.value;
    var hWin;
    var jsonObj = loadJSON(URL);
    jsonObj.onload=generateHTML(jsonObj);
    hWin = window.open("", "Assignment4", "height=800,width=600");
    hWin.document.write(html_text);
    hWin.document.close();
}

function loadJSON(url) {
    var xmlhttp, jsonObj;
    try {
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET",url,false); // "synchronous” (deprecated because it freezes the page while waiting for a response) *
        xmlhttp.send();
        jsonObj= JSON.parse(xmlhttp.responseText);
        return jsonObj;
    }
    catch ( exception )
    {
        alert("Request Failed " + exception);
    }
}

function generateHTML(jsonObj) {
    var root = jsonObj.DocumentElement;
    html_text = "<html><head><title>JSON Parse Result</title></head><body>";
    html_text += "<table border='2'>";
    // var caption = jsonObj.catalog.title;
    // html_text += "<caption align='left'><h1>" + caption + "</h1></caption>";
    var buildings_headers = jsonObj.Mainline.Table.Header.Data; // an array of planes
    // var buildingsNodeList = buildingsHeaders[0];
    html_text += "<tbody>";
    html_text += "<tr>";
    var x = 0,
        y = 0;
    // output the headers
    // var header_keys = Object.keys(buildingsNodeList);
    for (var i = 0; i < buildings_headers.length; i++) {
        var header = buildings_headers[i];
        switch (header, i) {
            case "Rank", "Rank of building", rank_index_const:
                header = "Test"
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
                case "Image", "Logo", image_index_const:
                    //handle images separately
                    html_text+="<td><img src='"+ buildingsNodeList[prop] +"' width='"+x+"' height='"+y+"'></td>";
                    break;

                case "City / Country", "Location Info", city_index_const:
                    let hubs = buildingsNodeList[prop].Hub
                    html_text += "<td><ul>"
                    for (var k = 0; k < hubs.length; k++) {
                        if (k == 0) {
                            html_text += "<li>" + hubs[k] + "</li>";
                        } else {
                            html_text += "<li>" + hubs[k] + "</li>";
                        }
                    }
                    html_text += "</ul></td>"

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

    // var root = jsonObj.DocumentElement;
    // html_text = "<html><head><title>JSON Parse Result</title></head><body>";
    // html_text += "<table border='2'>";
    // var caption = jsonObj.catalog.title;
    // html_text += "<caption align='left'><h1>" + caption + "</h1></caption>";
    // var planes = jsonObj.catalog.aircraft; // an array of planes
    // var planeNodeList = planes[0];
    // html_text += "<tbody>";
    // html_text += "<tr>";
    // var x = 0,
    //     y = 0;
    // // output the headers
    // var header_keys = Object.keys(planeNodeList);
    // for (var i = 0; i < header_keys.length; i++) {
    //     var header = header_keys[i];
    //     if (header == "Airbus") {
    //         header = "Family";
    //         x = 120;
    //         y = 55;
    //     }
    //     if (header == "Boeing") {
    //         header = "Family";
    //         x = 100;
    //         y = 67;
    //     }
    //     if (header == "seats") header = "Seats";
    //     if (header == "Wingspan") header = "Wing Span";
    //     if (header == "height") header = "Height";
    //     html_text += "<th>" + header + "</th>";
    // }
    // html_text += "</tr>";
    // // output out the values
    // for (i = 0; i < planes.length; i++) //do for all planes (one per row)
    // {
    //     planeNodeList = planes[i]; //get properties of a plane (an object)
    //     html_text += "<tr>"; //start a new row of the output table
    //     var aircraft_keys = Object.keys(planeNodeList);
    //     for (var j = 0; j < aircraft_keys.length; j++) {
    //         var prop = aircraft_keys[j];
    //         if (aircraft_keys[j] == "Image")
    //         {
    //             //handle images separately
    //             html_text+="<td><img src='"+ planeNodeList[prop] +"' width='"+x+"' height='"+y+"'></td>";
    //         } else {
    //             html_text += "<td>" + planeNodeList[prop] + "</td>";
    //         }
    //     }
    //     html_text += "</tr>";
    // }
    // html_text += "</tbody>";
    // html_text += "</table>";
    // html_text += "</bo" + "<dy> </html>";
}

// function loadFile() {
//     var input, file, fr;
//
//     if (typeof window.FileReader !== 'function') {
//         alert("The file API isn't supported on this browser yet.");
//         return;
//     }
//
//     input = document.getElementById('fileinput');
//     if (!input) {
//         alert("Um, couldn't find the fileinput element.");
//     } else if (!input.files) {
//         alert("This browser doesn't seem to support the `files` property of file inputs.");
//     } else if (!input.files[0]) {
//         alert("Please select a file before clicking 'Load'");
//     } else {
//         file = input.files[0];
//         fr = new FileReader();
//         fr.onload = receivedText;
//         fr.readAsText(file);
//     }
//
//     function receivedText(e) {
//         let lines = e.target.result;
//         var jsonObj = JSON.parse(lines);
//         jsonObj.onload = generateHTML(jsonObj);
//         var hWin = window.open("", "Assignment4", "height=800,width=600");
//         hWin.document.write(html_text);
//         hWin.document.close();
//     }
// }