var xhr = function(url,callback){
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

String.prototype.subs = function(map){
    var str = this;

    var targets = Object.keys(map);
    var i;

    for (i = 0; i < targets.length; i++) {
        while (str.indexOf("%" + targets[i] + "%") !== -1) {
            str = str.split("%" + targets[i] + "%").join(map[targets[i]]);
        }
    }

    return str;
};

var avg = function(nums){
    var args = arguments;
    var sum = 0;
    var i;
    for (i = 0; i < args.length; i++) {
        sum += args[i];
    }
    return sum / args.length;
};

/* start actual weather stuff */

var codeIconMap = {
    "clear-day": "Sun",
    "clear-night": "Moon",
    "rain": "Cloud-Rain",
    "snow": "Cloud-Snow",
    "sleet": "Cloud-Snow",
    "wind": "Wind",
    "fog": "Cloud-Fog",
    "cloudy": "Cloud",
    "partly-cloudy-day": "Cloud-Sun",
    "partly-cloudy-night": "Cloud-Moon"
};

var useImperial = false;

function displayWeather(data){
    var conditionData = data.weather.currently;

    var tempElem = document.querySelector("#temp");
    var temperatureElem = document.querySelector("#temperature");
    var conditionElem = document.querySelector("#condition");

    var temperature = conditionData.temperature;
    if (useImperial) {
        temperature = (temperature * 9 / 5) + 32;
    }

    tempElem.style.backgroundImage = "url(/img/weather/" + codeIconMap[conditionData.icon] + ".svg)";
    temperatureElem.textContent = Math.round(temperature).toString();
    conditionElem.textContent = conditionData.summary;

    document.body.classList.add("visible");
}

chrome.storage.sync.get("useFahrenheit", function (r) {
    var lastChecked;

    if (r.useFahrenheit !== undefined) {
        useImperial = r.useFahrenheit;
    }

    if (localStorage.last_checked) {
        lastChecked = Number(localStorage.last_checked);
    }

    if (!lastChecked || (new Date().getTime() - lastChecked >= 900000 && navigator.onLine)) {
        xhr("https://nntp-guardo.rhcloud.com/wx/", function(data){
            data = JSON.parse(data);

            displayWeather(data);

            localStorage.setItem("last_checked", new Date().getTime());
            localStorage.setItem("last_weather", JSON.stringify(data))
        });
    } else if (localStorage.last_weather) {
        displayWeather(JSON.parse(localStorage.getItem("last_weather")));
    }
});

document.body.addEventListener("click", function(){
    chrome.tabs.create({
        url: "http://forecast.io/"
    });
});
