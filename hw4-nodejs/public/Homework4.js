var html_text;

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
    var caption = jsonObj.catalog.title;
    html_text += "<caption align='left'><h1>" + caption + "</h1></caption>";
    var planes = jsonObj.catalog.aircraft; // an array of planes
    var planeNodeList = planes[0];
    html_text += "<tbody>";
    html_text += "<tr>";
    var x = 0,
        y = 0;
    // output the headers
    var header_keys = Object.keys(planeNodeList);
    for (var i = 0; i < header_keys.length; i++) {
        var header = header_keys[i];
        if (header == "Airbus") {
            header = "Family";
            x = 120;
            y = 55;
        }
        if (header == "Boeing") {
            header = "Family";
            x = 100;
            y = 67;
        }
        if (header == "seats") header = "Seats";
        if (header == "Wingspan") header = "Wing Span";
        if (header == "height") header = "Height";
        html_text += "<th>" + header + "</th>";
    }
    html_text += "</tr>";
    // output out the values
    for (i = 0; i < planes.length; i++) //do for all planes (one per row)
    {
        planeNodeList = planes[i]; //get properties of a plane (an object)
        html_text += "<tr>"; //start a new row of the output table
        var aircraft_keys = Object.keys(planeNodeList);
        for (var j = 0; j < aircraft_keys.length; j++) {
            var prop = aircraft_keys[j];
            if (aircraft_keys[j] == "Image")
            {
                //handle images separately
                html_text+="<td><img src='"+ planeNodeList[prop] +"' width='"+x+"' height='"+y+"'></td>";
            } else {
                html_text += "<td>" + planeNodeList[prop] + "</td>";
            }
        }
        html_text += "</tr>";
    }
    html_text += "</tbody>";
    html_text += "</table>";
    html_text += "</bo" + "<dy> </html>";
}

function loadFile() {
    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    } else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    } else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }

    function receivedText(e) {
        let lines = e.target.result;
        var jsonObj = JSON.parse(lines);
        jsonObj.onload = generateHTML(jsonObj);
        var hWin = window.open("", "Assignment4", "height=800,width=600");
        hWin.document.write(html_text);
        hWin.document.close();
    }
}