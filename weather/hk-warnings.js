var xhr = function(url,callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

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

String.prototype.capitalize = function(){
	var array = this.split(" ");
	var i;
	
	for (i=0; i<array.length; i++) {
		array[i] = array[i].charAt(0).toUpperCase() + array[i].substring(1, array[i].length);
	}
	
	return array.join(" ");
};

var debugWarnings = [];
var allWarnings = Object.keys(textIconMap);

for (i=0; i<allWarnings.length; i++) {
	debugWarnings.push({
		title: allWarnings[i] + " issued",
		publishedDate: Math.round(Math.random() * new Date().getTime())
	})
}

var debugFeed = {
	responseData: {
		feed: {
			entries: debugWarnings
		}
	}
};

function loadWarnings(r) {
	entries = r.responseData.feed.entries;

	var titles = [];

	for(i=0; i<entries.length; i++) {
		var title = entries[i].title.toLowerCase();
		title = title.substring(0,title.indexOf(" issued"));

		var date = new Date(entries[i].publishedDate).getTime();

		if (title in textIconMap) {
			var imgElement = document.createElement("div");
			imgElement.classList.add("hk_warning");
			
			var icon = "/img/hko/" + textIconMap[title];
			titles.push(icon);
			imgElement.style.backgroundImage = "url(" + icon + ")";
			
			imgElement.innerHTML = "<h2>" + title.capitalize() + "</h2><span>" + new Date(date).toString() + "</span>";
        }
	}

	if (titles.length > 0) {
		if (window.top.startFlashing) {
			window.top.startFlashing(titles);
		}
		console.log(titles);
	}
}

var url = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=loadWarnings&q=http://rss.weather.gov.hk/rss/WeatherWarningSummaryv2.xml";

var weatherCity = "", entries;

var warnContainer = document.querySelector("#warning_container");

chrome.storage.sync.get("weatherCity", function(r){
	if (r.weatherCity !== undefined) {
		weatherCity = r.weatherCity.toLowerCase();
	}
	if (weatherCity.indexOf("hk") != -1 || weatherCity.indexOf("hong kong") != -1) {
		var script = document.createElement("script");
		script.src = url;
		document.head.appendChild(script);
	}
});