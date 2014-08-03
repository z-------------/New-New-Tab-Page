var colors = {
        clear: "#47C5FF",
        storm: "#aaa",
        cloudy: "#a8becc",
        rainy: "#8ad",
        snow: "#ccc"
    },
    icons = {
        clear: "/img/weather/sunny.png",
        storm: "/img/weather/storm.png",
        cloudy: "/img/weather/cloudy.png",
        rainy: "/img/weather/rain.png",
        moon: "/img/weather/moon.png",
        snow: "/img/weather/snow.png",
        fog: "/img/weather/fog.png"
    }

var lastChecked = 0;
var useF = false;
var useImperial = false;
var city = "";

function getWeather(response) {
    if (response.current_observation) {
        localStorage.last_weather = JSON.stringify(response);

        var time = new Date();

        var weather = response.current_observation.weather;

        var temp;
        if (useF === true) {
            temp = Math.round(response.current_observation.temp_f);
        } else {
            temp = Math.round(response.current_observation.temp_c);
        }

        var iconURL;

        var isDay = (time.getHours() < 18 && time.getHours() >= 6);
        if (isDay) {
            if (weather == "Clear") {
                iconURL = icons.clear;
                document.body.style.background = colors.clear;
            } else if (weather.indexOf("Storm") > -1 || weather.indexOf("storm") > -1) {
                iconURL = icons.storm;
                document.body.style.background = colors.storm;
            } else if (weather.indexOf("Rain") > -1 || weather.indexOf("Shower") > -1 || weather.indexOf("Drizzle") > -1) {
                iconURL = icons.rainy;
                document.body.style.background = colors.rainy;
            } else if (weather.indexOf("Fog") > -1 || weather.indexOf("Haz") > -1 || weather.indexOf("Part") > -1) {
                iconURL = icons.fog;
                document.body.style.background = colors.cloudy;
            } else if (weather.indexOf("Cloud") > -1 || weather == "Overcast") {
                iconURL = icons.cloudy;
                document.body.style.background = colors.cloudy;
            } else if (weather.indexOf("Snow") > -1 || weather.indexOf("Hail") > -1) {
                iconURL = icons.snow;
                document.body.style.background = colors.snow;
            } else {
                console.log("Not sure which weather icon to use so defaulting to Clear");
                iconURL = icons.clear;
                document.body.style.background = colors.clear;
            }
        } else {
            iconURL = icons.moon;
            document.body.style.backgroundColor = colors.clear;
            document.getElementById("dark").style.display = "block";
        }

        document.getElementById("temp").innerHTML = "<h1>" + temp + "&#176;</h1><div>" + weather + "</div>";
        document.getElementById("weather").style.backgroundImage = "url(" + iconURL + ")";

        loadInfos(response.current_observation, response.forecast.simpleforecast.forecastday, response.satellite);

        window.top.getWeather(iconURL);
    }
}

chrome.storage.sync.get(["useFahrenheit", "weatherCity"], function (r) {
    if (r.useFahrenheit !== undefined) {
        useF = r.useFahrenheit;
        useImperial = useF;
    }
    if (r.weatherCity !== undefined) {
        city = r.weatherCity;
    }

    if (localStorage.last_checked) {
        lastChecked = Number(localStorage.last_checked);
    }

    if (new Date().getTime() - lastChecked >= 900000 && navigator.onLine) {
        var script = document.createElement("script");
        script.src = "https://api.wunderground.com/api/5d3e41d1ab52543e/conditions/forecast/satellite/q/" + city + ".json?callback=getWeather";
        // please don't use my key
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
<a href='http://www.wunderground.com/wundermap'><img class='map' src='%map_url%'></a>\
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

function loadInfos(data, forecast, satellite) {
    // show imperial units for the superior people of the USA, greatest country in the world
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
        map_url: satellite.image_url + "&width=500&height=500", // force it to show a 500x500 image

        tom_temp: tomTemp,
        tom_cond: forecast[1].conditions,
        oxt_temp: oxtTemp,
        oxt_cond: forecast[2].conditions,
        aoxt_temp: aoxtTemp,
        aoxt_cond: forecast[3].conditions
    });

    initWarnings();
}

function initWarnings() {
    var warningsScript = document.createElement("script");
    warningsScript.src = "hk-warnings.js";
    document.head.appendChild(warningsScript);
}