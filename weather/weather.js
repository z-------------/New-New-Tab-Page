var xhr = function(url,callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

var colors = {
    clear: "rgb(132, 165, 205)",
    storm: "rgb(54, 79, 86)",
    cloudy: "rgb(148, 151, 156)",
    rainy: "rgb(49, 82, 104)",
    snow: "rgb(106, 125, 133)",
    night: "rgb(49, 51, 72)",
    nightstorm: "rgb(70, 49, 46)",
    nightrain: "rgb(49, 82, 104)"
};

var icons = {
    clear: "/img/weather/sunny.png",
    storm: "/img/weather/storm.png",
    cloudy: "/img/weather/cloudy.png",
    rainy: "/img/weather/rain.png",
    moon: "/img/weather/moon.png",
    snow: "/img/weather/snow.png",
    fog: "/img/weather/fog.png"
};

var lastChecked = 0;
var useF = false;
var useImperial = false;
var city = "";

function getWeather(response) {
    if (response.current_observation) {
        localStorage.last_weather = JSON.stringify(response);

        var time = new Date();

        var weather = response.current_observation.weather;
        var lowerWeather = weather.toLowerCase();

        var temp;
        if (useF === true) {
            temp = Math.round(response.current_observation.temp_f);
        } else {
            temp = Math.round(response.current_observation.temp_c);
        }

        var iconURL;
        var condCanon;

        var isDay = (time.getHours() < 18 && time.getHours() >= 6);
        if (isDay) {
            if (lowerWeather === "clear") {
                iconURL = icons.clear;
                document.body.style.background = colors.clear;
                condCanon = "clear";
            } else if (lowerWeather.indexOf("storm") !== -1) {
                iconURL = icons.storm;
                document.body.style.background = colors.storm;
                condCanon = "storm";
            } else if (lowerWeather.indexOf("rain") !== -1 || lowerWeather.indexOf("shower") !== -1 || lowerWeather.indexOf("drizzle") !== -1) {
                iconURL = icons.rainy;
                document.body.style.background = colors.rainy;
                condCanon = "rain";
            } else if (lowerWeather.indexOf("fog") !== -1 || lowerWeather.indexOf("haz") !== -1) {
                iconURL = icons.fog;
                document.body.style.background = colors.cloudy;
                condCanon = "fog";
            } else if (lowerWeather.indexOf("cloud") !== -1 || lowerWeather.indexOf("overcast") !== -1) {
                iconURL = icons.cloudy;
                document.body.style.background = colors.cloudy;
                condCanon = "cloud";
            } else if (lowerWeather.indexOf("snow") !== -1 || lowerWeather.indexOf("hail") !== -1) {
                iconURL = icons.snow;
                document.body.style.background = colors.snow;
                condCanon = "snow";
            } else {
                iconURL = icons.clear;
                document.body.style.background = colors.clear;
                condCanon = "clear";
            }
        } else {
            iconURL = icons.moon;
            
            if (lowerWeather.indexOf("storm") !== -1) {
                document.body.style.background = colors.nightstorm;
                condCanon = "nightstorm";
            } else if (lowerWeather.indexOf("rain") !== -1 || lowerWeather.indexOf("shower") !== -1 || lowerWeather.indexOf("drizzle") !== -1) {
                document.body.style.background = colors.nightrain;
                condCanon = "nightrain";
            } else {
                document.body.style.background = colors.night;
                condCanon = "night";
            }
        }
        
        document.getElementById("temp").innerHTML = "<h1>" + temp + "&#176;</h1><div>" + weather + "</div>";
        document.getElementById("temp").style.backgroundImage = "url(" + iconURL + ")";

        loadInfos(response.current_observation, response.forecast.simpleforecast.forecastday, response.satellite, condCanon);

        window.top.getWeather(iconURL);
    }
}

chrome.storage.sync.get("useFahrenheit", function (r) {
    if (r.useFahrenheit !== undefined) {
        useF = r.useFahrenheit;
        useImperial = useF;
    }

    if (localStorage.last_checked) {
        lastChecked = Number(localStorage.last_checked);
    }

    if (!lastChecked || (new Date().getTime() - lastChecked >= 900000 && navigator.onLine)) {
        var script = document.createElement("script");
        script.src = "https://api.wunderground.com/api/5d3e41d1ab52543e/conditions/forecast/satellite/q/autoip.json?callback=getWeather";
        // please don't use my api key
        // i'm on a free account anyway
        document.getElementsByTagName("head")[0].appendChild(script);
        localStorage.last_checked = new Date().getTime();
    } else if (localStorage.last_weather) {
        getWeather(JSON.parse(localStorage.last_weather));
    }
});

String.prototype.subs = function (map) {
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

function avg(nums) {
    var args = arguments;
    var sum = 0;
    var i;
    for (i = 0; i < args.length; i++) {
        sum += args[i];
    }
    return sum / args.length;
}

var infosTemplate = "\
<li id='forecast'>\
<h2>Forecast</h2>\
<table>\
<tr>\
<th>%tom%</th>\
<th>%oxt%</th>\
<th>%aoxt%</th>\
</tr>\
<tr>\
<td><span>%tom_temp%</span>%tom_cond%</td>\
<td><span>%oxt_temp%</span>%oxt_cond%</td>\
<td><span>%aoxt_temp%</span>%aoxt_cond%</td>\
</tr>\
</table>\
</li>\
\
<li id='wind'>\
<h2>Wind</h2>\
<div class='arrow' style='-webkit-transform:rotate(%arrow_deg%deg)'>&uarr;</div>\
<div class='details'>\
<p>%wind_dir% (%wind_deg%&deg;)</p>\
<p>%wind_speed%</p>\
</div>\
</li>\
\
<li id='map'>\
<h2>Map</h2>\
<a href='http://www.wunderground.com/wundermap'>\
<div class='map'>\
<img class='base' src='%map_base%'>\
<img class='overlay' src='%map_overlay%'>\
</div>\
</a>\
</li>\
\
<li id='details'>\
<table class='incog'>\
<tr>\
<th>Feels like</th>\
<td>%feels_like%</td>\
</tr>\
<tr>\
<th>Visibility</th>\
<td>%visib%</td>\
</tr>\
<tr>\
<th>UV Index</th>\
<td>%uv%</td>\
</tr>\
<tr>\
<th>Dew point</th>\
<td>%dew_point%</td>\
</tr>\
<tr>\
<th>Relative humidity</th>\
<td>%rel_humid%</td>\
</tr>\
<tr>\
<th>Air pressure</th>\
<td>%pressure%</td>\
</tr>\
</table>\
</li>\
</ul>";

var infosUl = document.querySelector("#infos");

function loadInfos(data, forecast, satellite, condCanon) {
    var windSpeed, visibility, dewPoint, feelsLike;
    var tomTemp, oxtTemp, aoxtTemp; // "oxt" - an invented word meaning "not this coming one but the one after that"
    if (useImperial) {
        windSpeed = data.wind_mph + " mph";
        visibility = data.visibility_mi + " mi";
        dewPoint = data.dewpoint_f + "&deg;F";
        feelsLike = data.feelslike_f + "&deg;F";

        tomTemp = avg(Number(forecast[1].high.fahrenheit), Number(forecast[1].low.fahrenheit)) + "&deg;F";
        oxtTemp = avg(Number(forecast[2].high.fahrenheit), Number(forecast[2].low.fahrenheit)) + "&deg;F";
        aoxtTemp = avg(Number(forecast[3].high.fahrenheit), Number(forecast[3].low.fahrenheit)) + "&deg;F";
    } else {
        windSpeed = data.wind_kph + " km/h";
        visibility = data.visibility_km + " km";
        dewPoint = data.dewpoint_c + "&deg;C";
        feelsLike = data.feelslike_c + "&deg;C";

        tomTemp = avg(Number(forecast[1].high.celsius), Number(forecast[1].low.celsius)) + "&deg;C";
        oxtTemp = avg(Number(forecast[2].high.celsius), Number(forecast[2].low.celsius)) + "&deg;C";
        aoxtTemp = avg(Number(forecast[3].high.celsius), Number(forecast[3].low.celsius)) + "&deg;C";
    }

    infosUl.innerHTML = infosTemplate.subs({
        wind_deg: data.wind_degrees,
        wind_dir: data.wind_dir,
        arrow_deg: data.wind_degrees + 180,
        wind_speed: windSpeed,
        visib: visibility,
        uv: data.UV,
        dew_point: dewPoint,
        rel_humid: data.relative_humidity,
        pressure: data.pressure_mb + " mbar",
        feels_like: feelsLike,
        tom: forecast[1].date.weekday,
        oxt: forecast[2].date.weekday,
        aoxt: forecast[3].date.weekday,

        tom_temp: tomTemp,
        tom_cond: forecast[1].conditions,
        oxt_temp: oxtTemp,
        oxt_cond: forecast[2].conditions,
        aoxt_temp: aoxtTemp,
        aoxt_cond: forecast[3].conditions,
        
        map_overlay: satellite.image_url_ir4 + "&width=500&height=500&borders=0&basemap=0&gtt=110",
        map_base: "http://maps.googleapis.com/maps/api/staticmap?center=" + data.display_location.latitude + "," + data.display_location.longitude + "&zoom=8&size=500x500&maptype=hybrid"
    });

    initWarnings();
    initHeaderBG(condCanon);
    
    document.querySelector(".map").style.height = document.querySelector(".map").offsetWidth + "px";
}

function initWarnings() {
    var warningsScript = document.createElement("script");
    warningsScript.src = "hk-warnings.js";
    document.head.appendChild(warningsScript);
}

var headerBG = document.querySelector("#header-bg");
var finalHeaderUrl;
var loadHeader;

function initHeaderBG(cond) {
    var wxPhotos = {
        clear: {
            url: "https://farm3.staticflickr.com/2543/3874874014_ed5de0880d_b.jpg",
            author: "Jim",
            link: "https://www.flickr.com/photos/jarroast/3874874014"
        },
        rain: {
            url: "https://farm3.staticflickr.com/2671/4023111353_fb446deeac_b.jpg",
            author: "Moyan Brenn",
            link: "https://www.flickr.com/photos/aigle_dore/4023111353"
        },
        cloud: {
            url: "https://farm8.staticflickr.com/7222/7339637786_80ca18ac80_b.jpg",
            author: "Michael Taggart",
            link: "https://www.flickr.com/photos/michael_harold/7339637786"
        },
        storm: {
            url: "https://farm3.staticflickr.com/2927/14524963637_27cea1e31b_b.jpg",
            author: "mLu.fotos",
            link: "https://www.flickr.com/photos/luppes777/14524963637"
        },
        fog: {
            url: "https://farm6.staticflickr.com/5577/14777909183_b119ca6982_b.jpg",
            author: "jblaha",
            link: "https://www.flickr.com/photos/blahafotos/14777909183"
        },
        snow: {
            url: "https://farm8.staticflickr.com/7154/6770916105_4081e531a4_b.jpg",
            author: "Rachel Kramer",
            link: "https://www.flickr.com/photos/rkramer62/6770916105"
        },
        night: {
            url: "https://farm8.staticflickr.com/7324/14100149394_96f56ce781_b.jpg",
            author: "Matthew Savage",
            link: "https://www.flickr.com/photos/msavagephotography/14100149394"
        },
        nightstorm: {
            url: "https://farm4.staticflickr.com/3882/14503085829_af8c3d36cc_b.jpg",
            author: "Brian Tomlinson",
            link: "https://www.flickr.com/photos/brian_tomlinson/14503085829"
        },
        nightrain: {
            url: "https://farm3.staticflickr.com/2671/4023111353_fb446deeac_b.jpg",
            author: "Moyan Brenn",
            link: "https://www.flickr.com/photos/aigle_dore/4023111353"
        }
    };
    
    finalHeaderBgStyle = "url(" + wxPhotos[cond].url + ")";
    loadHeader = function(){
        headerBG.style.backgroundImage = finalHeaderBgStyle;
    };
    
    document.querySelector("footer").innerHTML += "&bull; Photo by <a href='" + wxPhotos[cond].link + "'>" + wxPhotos[cond].author + "</a>";
}

window.addEventListener("scroll", function(){
    headerBG.style.backgroundPositionY = "calc(50% + " + window.scrollY/3 + "px)";
});