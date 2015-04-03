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
    0: "Tornado",
    1: "Cloud-Rain",
    2: "Cloud-Rain",
    3: "Cloud-Lightning",
    4: "Cloud-Lightning",
    5: "Cloud-Rain",
    6: "Cloud-Rain",
    7: "Cloud-Snow",
    8: "Cloud-Drizzle",
    9: "Cloud-Drizzle",
    10: "Cloud-Rain",
    11: "Cloud-Drizzle",
    12: "Cloud-Drizzle",
    13: "Cloud-Snow",
    14: "Cloud-Snow",
    15: "Cloud-Snow",
    16: "Cloud-Snow",
    17: "Cloud-Hail",
    18: "Cloud-Snow",
    19: "Cloud-Fog",
    20: "Cloud-Fog",
    21: "Cloud-Fog",
    22: "Cloud-Fog",
    23: "Wind",
    24: "Wind",
    25: "Thermometer-Zero",
    26: "Cloud",
    27: "Cloud-Moon",
    28: "Cloud-Sun",
    29: "Cloud-Moon",
    30: "Cloud-Sun",
    31: "Moon",
    32: "Sun",
    33: "Moon",
    34: "Sun",
    35: "Hail",
    36: "Thermometer-75",
    37: "Cloud-Lightning",
    38: "Cloud-Lightning",
    39: "Cloud-Lightning",
    40: "Cloud-Drizzle",
    41: "Cloud-Snow",
    42: "Cloud-Snow",
    43: "Cloud-Snow",
    44: "Cloud",
    45: "Cloud-Rain",
    46: "Cloud-Snow",
    47: "Cloud-Rain",
    3200: "Cloud"
};

var useImperial = false;

function displayWeather(data){
    console.log(data);
    console.log(useImperial);
    
    var conditionData = data.query.results.channel.item.condition;
    
    var tempElem = document.querySelector("#temp");
    var temperatureElem = document.querySelector("#temperature");
    var conditionElem = document.querySelector("#condition");
    
    var temperature = Math.round((useImperial ? conditionData.temp : 5 / 9 * (conditionData.temp - 32)));
    
    tempElem.style.backgroundImage = "url(/img/weather/" + codeIconMap[Number(conditionData.code)] + ".svg)";
    temperatureElem.textContent = temperature;
    conditionElem.textContent = conditionData.text;
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
        url: "https://weather.yahoo.com/"
    });
});