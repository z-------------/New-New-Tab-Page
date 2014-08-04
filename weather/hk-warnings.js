var xhr = function (url, callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function () {
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

var hkBounds = [ // top left, bottom right
    [22.6, 113.8], [22.2, 114.4]
]

var textIconMap = {
    "yellow fire danger warning": "warning_firey.png",
    "red fire danger warning": "warning_firer.png",
    "standby signal, no. 1": "No._01_Standby_Signal.png",
    "strong wind signal, no. 3": "No._03_Strong_Wind_Signal.png",
    "no. 8 northeast gale or storm signal": "No._8_Northeast_Gale_or_Storm_Signal.png",
    "no. 8 northwest gale or storm signal": "No._8_Northwest_Gale_or_Storm_Signal.png",
    "no. 8 southeast gale or storm signal": "No._8_Southeast_Gale_or_Storm_Signal.png",
    "no. 8 southwest gale or storm signal": "No._8_Southwest_Gale_or_Storm_Signal.png",
    "increasing gale or storm signal, no. 9": "No._09_Increasing_Gale_or_Storm_Signal.png",
    "hurricane signal, no. 10": "No._10_Hurricane_Signal.png",
    "amber rainstorm warning signal": "Rainstorm_Amber.png",
    "red rainstorm warning signal": "Rainstorm_Red.png",
    "black rainstorm warning signal": "Rainstorm_Black.png",
    "thunderstorm warning": "Thunderstorm_Warning.png",
    "special announcement on flooding in northern new territories": "warning_ntfl.png",
    "landslip warning": "Landslip.png",
    "strong monsoon signal": "warning_sms.png",
    "frost warning": "warning_frost.png",
    "cold weather warning": "Cold_Weather_Warning.png",
    "very hot weather warning": "Very_Hot_Weather_Warning.png",
    "tsunami warning": "warning_tsunami.png"
};

String.prototype.capitalize = function () {
    var array = this.split(" ");
    var i;

    for (i = 0; i < array.length; i++) {
        array[i] = array[i].charAt(0).toUpperCase() + array[i].substring(1, array[i].length);
    }

    return array.join(" ");
};

var debugWarnings = [];
var allWarnings = Object.keys(textIconMap);

for (i = 0; i < allWarnings.length; i++) {
    debugWarnings.push({
        title: allWarnings[i] + " issued",
        publishedDate: Math.round(Math.random() * new Date().getTime())
    })
}

var debugFeed = { // pass this to loadWarnings function to debug
    responseData: {
        feed: {
            entries: debugWarnings
        }
    }
};

function loadWarnings(r) {
    entries = r.responseData.feed.entries;

    var titles = [];

    var warningsLI = document.createElement("li");
    warningsLI.setAttribute("id", "warnings");

    infosUl.insertBefore(warningsLI, infosUl.children[0]);

    for (i = 0; i < entries.length; i++) {
        var title = entries[i].title.toLowerCase();
        title = title.substring(0, title.indexOf(" issued"));

        var date = new Date(entries[i].publishedDate).getTime();

        if (textIconMap.hasOwnProperty(title)) {
            var imgElement = document.createElement("div");
            imgElement.classList.add("hk_warning");

            var icon = "/img/hko/" + textIconMap[title];
            titles.push(icon);
            
            imgElement.style.backgroundImage = "url(" + icon + ")";
            imgElement.innerHTML = "<h3>" + title.capitalize() + "</h3><span>" + new Date(date).toString() + "</span>";

            warningsLI.appendChild(imgElement);
        }
    }

    if (titles.length > 0) {
        if (window.top.startFlashing) {
            window.top.startFlashing(titles);
        }

        warningsLI.classList.add("visible");
    }
}

var url = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=loadWarnings&q=http://rss.weather.gov.hk/rss/WeatherWarningSummaryv2.xml";

var entries;

var warnContainer = document.querySelector("#warning_container");

chrome.storage.sync.get("weatherCity", function(r){
    coords = r.weatherCity.split(",");
    console.log(coords);
    if (Number(coords[0]) && Number(coords[1])) {
        coords[0] = Number(coords[0]);
        coords[1] = Number(coords[1]);
    }

    if ((coords[0] <= hkBounds[0][0] && coords[0] >= hkBounds[1][0] && coords[1] >= hkBounds[0][1] && coords[0] <= hkBounds[1][1]) || coords.join().toLowerCase().indexOf("hong kong") !== -1) {
        var script = document.createElement("script");
        script.src = url;
        document.head.appendChild(script);
    }
});