var xhr = function(url,callback) { // my xhr function from http://gist.github.com
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
    "tsunami warning": "warning_tsunami_warn.png"
}

// this is kinda urlception
// the hko rss goes thru the google feed api and then thru jsonproxy to allow it to work with xhr()
var url = "http://jsonp.jit.su/?url=http%3A%2F%2Fajax.googleapis.com%2Fajax%2Fservices%2Ffeed%2Fload%3Fv%3D1.0%26num%3D10%26q%3Dhttp%3A%2F%2Frss.weather.gov.hk%2Frss%2FWeatherWarningSummaryv2.xml";
//var url = "http://jsonp.jit.su/?url=http%3A%2F%2Fajax.googleapis.com%2Fajax%2Fservices%2Ffeed%2Fload%3Fv%3D1.0%26num%3D10%26q%3Dhttp%3A%2F%2Fweb.archive.org%2Fweb%2F20131216053423%2Fhttp%3A%2F%2Frss.weather.gov.hk%2Frss%2FWeatherWarningSummaryv2.xml";

var weatherCity = localStorage.weather_city.toLowerCase();

if (weatherCity.indexOf("hk") != -1 || weatherCity.indexOf("hong kong") != -1) {
    xhr(url,function(r){ // load the url thru my xhr function
        r = JSON.parse(r); // turn string into object so we can read it
        var entries = r.responseData.feed.entries; // shortcut to entries array
        /*var entries = [{
            title:"Tsunami warning issued"
        },{
            title:"Cold weather warning issued"
        },{
            title:"Hurricane signal, no. 10 issued"
        }]*/
        var titles = [];
        for(i=0; i<entries.length; i++) { // for each element of entries
            var title = entries[i].title.toLowerCase(); // shortcut to title
            title = title.substring(0,title.indexOf(" issued"));
            if (title in textIconMap) {
                var imgElement = document.createElement("img");
                imgElement.classList.add("hk_warning");
                titles[i] = imgElement.src = "/img/hko/" + textIconMap[title];
                imgElement.onclick = function(){
                    window.top.location = "http://www.hko.gov.hk/contente.htm";
                }
                document.querySelector("#warning_container").appendChild(imgElement);
            }
        }
        if (titles.length > 0) {
            window.top.startFlashing(titles);
        }
    })
}