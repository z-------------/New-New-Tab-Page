var colors = {
    clear: "#47C5FF",
    storm: "#aaa",
    cloudy: "#a8becc",
    rainy: "#8ad",
    snow: "#ccc"
},
icons = {
    clear: "img/weather/sunny.png",
    storm: "img/weather/storm.png",
    cloudy: "img/weather/cloudy.png",
    rainy: "img/weather/rain.png",
    moon: "img/weather/moon.png",
    snow: "img/weather/snow.png",
    fog: "img/weather/fog.png"
}

var lastChecked = 0;

var useF = eval(localStorage.usefahrenheit);
function getWeather(response) {
    if (response.current_observation) {
        localStorage.last_weather = JSON.stringify(response);
        var weather = response.current_observation.weather, temp;
        if (useF == true) {
            temp = Math.round(response.current_observation.temp_f);
        } else {
            temp = Math.round(response.current_observation.temp_c);
        }
        window.top.iconWea = weather;
        window.onload = function () {
            document.getElementById("temp").innerHTML = temp + "&#176;";
            var time = new Date();
            var isDay = (time.getHours() < 18 && time.getHours() >= 6);
            if (isDay) {
                if (weather == "Clear") {
                    document.getElementById("icon").style.backgroundImage = "url(" + icons.clear + ")";
                    document.body.style.background = colors.clear;
                } else if (weather.indexOf("Storm") > -1 || weather.indexOf("storm") > -1) {
                    document.getElementById("icon").style.backgroundImage = "url(" + icons.storm + ")";
                    document.body.style.background = colors.storm;
                } else if (weather.indexOf("Rain") > -1 || weather.indexOf("Shower") > -1 || weather.indexOf("Drizzle") > -1) {
                    document.getElementById("icon").style.backgroundImage = "url(" + icons.rainy + ")";
                    document.body.style.background = colors.rainy;
                } else if (weather.indexOf("Fog") > -1 || weather.indexOf("Haz") > -1 || weather.indexOf("Part") > -1) {
                    document.getElementById("icon").style.backgroundImage = "url(" + icons.fog + ")";
                    document.body.style.background = colors.cloudy;
                } else if (weather.indexOf("Cloud") > -1 || weather == "Overcast") {
                    document.getElementById("icon").style.backgroundImage = "url(" + icons.cloudy + ")";
                    document.body.style.background = colors.cloudy;
                } else if (weather.indexOf("Snow") > -1 || weather.indexOf("Hail") > -1) {
                    document.getElementById("icon").style.backgroundImage = "url(" + icons.snow + ")";
                    document.body.style.background = colors.snow;
                } else {
                    console.log("Not sure which weather icon to use so defaulting to icons.clear and colors.clear");
                    document.getElementById("icon").style.backgroundImage = "url(" + icons.moon + ")";
                    document.body.style.background = colors.clear;
                }
            } else {
                document.getElementById("icon").style.backgroundImage = "url(" + icons.moon + ")";
                document.body.style.background = colors.clear;
                document.getElementById("dark").style.display = "block";
            }
            document.getElementById("weather").onclick = function () {
                window.location = "http://www.wunderground.com/cgi-bin/findweather/hdfForecast?query=" + encodeURI(city);
            }
        }
        window.parent.getWeather();
    }
}
if (localStorage.weather_city) {
    var city = localStorage.weather_city;
}
if (localStorage.last_checked) {
    lastChecked = localStorage.last_checked;
}

if (new Date().getTime() - lastChecked >= 900000) { // 15 minutes
    var script = document.createElement("script");
    script.src = "https://api.wunderground.com/api/5d3e41d1ab52543e/conditions/q/" + city + ".json?callback=getWeather";
    document.getElementsByTagName("head")[0].appendChild(script);
    localStorage.last_checked = new Date().getTime();
} else {
    getWeather(JSON.parse(localStorage.last_weather));
}