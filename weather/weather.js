var xhr = function(url,callback) {
  var oReq = new XMLHttpRequest()
  oReq.onload = function() {
    var response = this.responseText
    callback(response)
  }
  oReq.open("get", url, true)
  oReq.send()
}

String.prototype.subs = function(map) {
  var str = this

  var targets = Object.keys(map)
  var i

  for (i = 0; i < targets.length; i++) {
    while (str.indexOf("%" + targets[i] + "%") !== -1) {
      str = str.split("%" + targets[i] + "%").join(map[targets[i]])
    }
  }

  return str
}

// var avg = function(nums) {
//   var args = arguments
//   var sum = 0
//   var i
//   for (i = 0; i < args.length; i++) {
//     sum += args[i]
//   }
//   return sum / args.length
// }

/* start actual weather stuff */

const availableLocales = [// as provided by Dark Sky's api
  "ar", "az", "be", "bg", "bs", "ca", "cs", "de", "el", "en", "es", "et", "fr",
  "hr", "hu", "id", "it", "is", "kw", "nb", "nl", "pl", "pt", "ru", "sk", "sl",
  "sr", "sv", "tet", "tr", "uk", "zh"
] // and zh-tw, handled separately

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
}

var useImperial = false
var overrideWxLocation = false
var wxCoordsLat = 0
var wxCoordsLong = 0
var lastChecked

function displayWeather(data) {
  var conditionData = data.weather.currently

  var tempElem = document.getElementById("temp")
  var temperatureElem = document.getElementById("temperature")
  var conditionElem = document.getElementById("condition")

  var temperature = conditionData.temperature
  if (useImperial) {
    temperature = (temperature * 9 / 5) + 32
  }

  tempElem.style.backgroundImage = `url(/img/weather/${codeIconMap[conditionData.icon]}.svg)`
  temperatureElem.textContent = Math.round(temperature).toString()
  conditionElem.textContent = conditionData.summary

  document.body.classList.add("visible")
}

var dontUseCache

function gotCoords() {
  var requestUrl = "https://nntp-server-redux.netlify.com/.netlify/functions/wx?foo=bar"
  if (overrideWxLocation) {
    requestUrl += `&coords=${wxCoordsLat},${wxCoordsLong}`
  }

  var chromeUILang = chrome.i18n.getUILanguage()
  if (chromeUILang.toLowerCase() === "zh-tw") {
    requestUrl += "&lang=zh-tw"
  } else if (availableLocales.indexOf(chromeUILang.split("-")[0]) !== -1) {
    requestUrl += `&lang=${chromeUILang.split("-")[0]}`
  }

  if (dontUseCache) {
    // console.log("getting fresh weather")
    xhr(requestUrl, function(data) {
      data = JSON.parse(data)

      displayWeather(data)

      localStorage.setItem("last_checked", new Date().getTime())
      localStorage.setItem("last_weather", JSON.stringify(data))
    })
  } else if (localStorage.last_weather) {
    // console.log("using cached weather")
    displayWeather(JSON.parse(localStorage.getItem("last_weather")))
  }
}

chrome.storage.sync.get(["useFahrenheit", "overrideWxLocation", "wxCoordsLat", "wxCoordsLong", "wxUseGPS"], function(r) {
  if (r.useFahrenheit !== undefined) {
    useImperial = r.useFahrenheit
  }

  if (r.overrideWxLocation === true) {
    overrideWxLocation = true
    if (r.wxCoordsLat) {
      wxCoordsLat = r.wxCoordsLat
    }
    if (r.wxCoordsLong) {
      wxCoordsLong = r.wxCoordsLong
    }
  }

  if (localStorage.last_checked) {
    lastChecked = Number(localStorage.last_checked)
    dontUseCache = !lastChecked || (new Date().getTime() - lastChecked >= 900000 && navigator.onLine)
  } else {
    dontUseCache = true
  }

  if (dontUseCache && r.wxUseGPS === true && overrideWxLocation === false) {
    navigator.geolocation.getCurrentPosition((r) => {
      overrideWxLocation = true
      wxCoordsLat = r.coords.latitude
      wxCoordsLong = r.coords.longitude
      gotCoords()
    }, (err) => {
      if (err && (err.code === 1 || err.code === 2 || err.code === 3)) {
        gotCoords() // fall back to IP-based location
      }
    })
  } else {
    gotCoords()
  }
})

document.body.addEventListener("click", function(e) {
  if (e.target.tagName.toLowerCase() !== "a") {
    chrome.tabs.create({
      url: "https://darksky.net/"
    })
  }
})
