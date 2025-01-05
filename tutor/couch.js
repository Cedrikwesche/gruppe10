var loginname = 'admin'
var loginpass = 'admin'

var request = new XMLHttpRequest();

request.onreadystatechange = function() {
    console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
    console.log(request.responseText);
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            handlers[response._id](response);
        }
        if (request.status == 404) {
            var json = JSON.parse(request.responseText);
            if (json.reason === "no_db_file") {
                createDB();
            } else {
                var url = request.responseURL
//              console.log(typeof(url));
                var i = url.lastIndexOf("/", url.length - 1);
                var name = url.substring(i + 1);
                handlers[name]({ "_id" : name });
            }
        }
    }
};

function getCheckedRadio(name) {
    var options = document.getElementsByName(name);
    for (i = 0; i < options.length; i++) {
        var option = options[i];
        if (option.checked) {
            return option.value;
        }
    }
    return null;
}

function set(name) {
    console.log("set::name = " + name);
    console.log("set::GET = " + dburl + name);
    request.open("GET", dburl + name, true);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
	request.withCredentials = true;
    request.send();
}

function put(response, message) {
    console.log("put::response = " + response);
    console.log("put::message = " + message);
    request.open("PUT", dburl + response._id, true);
    request.setRequestHeader("Content-type", "application/json");
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    message["_id"] = response._id;
    if (response._rev) {
        message["_rev"] = response._rev;
    }
    var s = JSON.stringify(message);
//  console.log("put: " + s);
    request.send(s);
}

function createDB() {
    request.open("PUT", dburl, true);
	request.setRequestHeader("Authorization", "Basic " + btoa(loginname + ":" + loginpass));
    request.send();
}

///////////////////////////////////////////////////////////////////////////////
// your code below

var dbname = "assignment";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
    "animal" : setAnimal,
    "counter" : stepCounter,
    "showCounter" : showCounter,
    "mytext" : mytext,
    // add further handlers here
	"assignment1" : assignment1,
	"assignment2" : assignment2,
};

function setAnimal(response) {
    var src = getCheckedRadio("animalImage");
    var width = parseInt(document.getElementById("animalWidth").value);
    // console.log(src);
    // console.log(width);
    put(response, {"src" : src, "width" : width});
}

function stepCounter(response) {
    var value = response.value ? response.value : 0;
    // console.log(value);
    put(response, {"value" : value + 1});
}

function showCounter(response) {
    var checked = document.getElementById("showCounter").checked;
    // console.log(checked);
    put(response, {"checked" : checked});
}

function mytext(response) {
    var value = document.getElementById("mytext").value;
//  console.log("mytext::value = " + value);
    put(response, {"value" : value});
}

function assignment1(response) {
    var value = document.getElementById("assignment1").value;
	console.log("assignment1::value = " + value);
    put(response, {"value" : value});
}

function assignment2(response) {
    var value = document.getElementById("assignment2").value;
	console.log("assignment2::value = " + value);
    put(response, {"value" : value});
}