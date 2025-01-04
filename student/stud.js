var loginname = 'admin'
var loginpass = 'admin'

var request = new XMLHttpRequest();

request.onreadystatechange = function() {
    // console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
    // console.log(request.responseText);
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            handlers[response._id](response);
        }
        if (request.status == 404) {
            console.log("not found: " + request.responseText);
        }
    }
};

function get(variable) {
    // console.log("get " + variable);
    request.open("GET", dburl + variable, false);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

function update() {
    for (var name in handlers) {
        // console.log("updating " + name);
        get(name);
    }
}

// request updates at a fixed interval (ms)
var intervalID = setInterval(update, 1000);

///////////////////////////////////////////////////////////////////////////////
// your code below

var dbname = "assignment";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
    //"animal" : updateAnimal,
    //"showCounter" : showCounter,
    //"counter" : updateCounter,
    //"mytext" : updateText,
    // add further handlers here
	"assignment1" : updateAssignment1,
	"assignment2" : updateAssignment2,
};

function updateAnimal(response) {
    document.getElementById(response._id).src = response.src;
    document.getElementById(response._id).width = response.width;
}

function updateCounter(response) {
    document.getElementById(response._id).innerHTML =
        showCounter ? response.value : "";
}

var showCounter = true;

function showCounter(response) {
    showCounter = response.checked;
}

function updateText(response) {
    document.getElementById("mytext").innerHTML = response.value;
}

function updateAssignment1(response) {
    document.getElementById("assignment1").innerHTML = response.value;
}

function updateAssignment2(response) {
    document.getElementById("assignment2").innerHTML = response.value;
}
