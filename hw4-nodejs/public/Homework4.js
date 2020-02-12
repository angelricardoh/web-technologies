var html_text;
const rank_key = "Rank";
const name_key = "Name";
const hubs_key = "Hubs";
const height_key = "Height";
const wikipage_key = "HomePage";
const image_key = "Logo";

function viewJSON(what) {
    var URL = what.URL.value;
    if (URL == "") {
        alert("The text box is empty. Please write a file name to process it.\n.");
        return;
    }
    var hWin;
    var jsonObj = loadJSON(URL);
    if(isEmpty(jsonObj) || typeof(jsonObj) === 'undefined') {
        alert("File is empty");
        return;
    }
    if (typeof(jsonObj.Mainline.Table.Row)==='undefined' || jsonObj.Mainline.Table.Row.length == 0) {
        alert("No data in file. Either Row key is undefined or does not contain values")
        return;
    }
    try {
        jsonObj.onload = generateHTML(jsonObj);
    }
    catch (error)
    {
        if (error.message == "malformed") {
            alert("Malformed file. One or more keys are missing");
        } else {
            alert("Unknown error " + error);
        }
        return;
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
        if (xmlhttpRequest.status==404){
            alert("File does not exist!");
            return;
        }
        jsonObj= JSON.parse(xmlhttpRequest.responseText);
        return jsonObj;
    }
    catch (exception)
    {
        alert("Unknown error loading JSON " + exception.message);
    }
}

function generateHTML(jsonObj) {
    var root = jsonObj.DocumentElement;
    html_text = "<html><head><title>JSON Parse Result</title></head><body>";
    html_text += "<table border='2'>";
    if (typeof(jsonObj.Mainline) === "undefined" ||
        typeof(jsonObj.Mainline.Table) === "undefined" ||
        typeof(jsonObj.Mainline.Table.Header) === "undefined" ||
        typeof(jsonObj.Mainline.Table.Header.Data) === "undefined") {
        throw new Error("malformed");
    }
    var buildings_headers = jsonObj.Mainline.Table.Header.Data; // an array of planes
    var headers_count = buildings_headers.length;
    html_text += "<tbody>";
    html_text += "<tr>";
    var x = 0,
        y = 0;
    // output the headers
    for (index in Object.values(buildings_headers)) {
        html_text += "<th>" + buildings_headers[index] + "</th>";
    }
    html_text += "</tr>";
    const buildings = jsonObj.Mainline.Table.Row;
    // output out the values
    for (let i = 0; i < buildings.length; i++) //do for all planes (one per row)
    {
        let buildingsNodeList = buildings[i]; //get properties of a plane (an object)
        html_text += "<tr>"; //start a new row of the output table
        const buildings_keys = Object.keys(buildingsNodeList);
        if (buildings_keys.length != headers_count) {
            throw new Error("malformed");
        }
        for (let prop in buildings_keys) {
            let building_key = buildings_keys[prop];
            switch (building_key) {
                case hubs_key:
                    let hubs = buildingsNodeList[building_key].Hub;
                    if (typeof(hubs) === "undefined") throw new Error("malformed");
                    html_text += "<td><ul>";
                    first_header = true;
                    for (index in hubs) {
                        if (hubs[index] == "") {
                            continue;
                        }

                        if (first_header) {
                            html_text += "<li><b>" + hubs[index] + "</b></li>";
                            first_header = false;
                        } else {
                            html_text += "<li>" + hubs[index] + "</li>";
                        }
                    }
                    html_text += "</ul></td>";
                    break;

                case wikipage_key:
                    html_text += "<td><a href='" + buildingsNodeList[building_key] + "'>" + buildingsNodeList[building_key] + "</td>";
                    break;

                case image_key:
                    //handle images separately
                    html_text += "<td><img src='" + buildingsNodeList[building_key] + "' width='" + 160 + "' height='" + 160 + "'></td>";
                    break;

                default:
                    html_text += "<td>" + buildingsNodeList[building_key] + "</td>";
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
    for(const key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}