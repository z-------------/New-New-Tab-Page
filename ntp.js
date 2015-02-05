var storage = chrome.storage.sync;

var settings = {
    slotCount: 3,
    appIconSize: 130,
    showAppsDrawer: true,
    topSiteCount: 6,
    showBookmarks: false,
    showAllBookmarks: false,
    firstRun: false,
    backgroundURL: "url(/img/bg.png)",
    bgBlur: false,
    disableAnimation: false,
    titleText: "New Tab",
    showWeather: false,
    showFB: false,
    showFBNotif: false,
    showStumble: false,
    autoClose: true,
    showNews: false,
    showTumblr: false,
    apps: [],
    noAnimation: false
};

String.prototype.getDomain = function () {
    var temp = document.createElement("a");
    temp.href = this;
    return temp.protocol + "//" + temp.host;
};

function iconBGColor(url) {
    var img = document.createElement("img");
    img.src = url;

    var width = img.width;
    var height = img.height;

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0);

    var data;
    var sum = {
        r: 0,
        g: 0,
        b: 0
    };

    try {
        data = ctx.getImageData(0, 0, width, 1).data;

        for (i = 0; i < width * 4; i += 4) {
            sum.r += data[i];
            sum.g += data[i + 1];
            sum.b += data[i + 2];
        }

        sum.r = Math.round(sum.r / width);
        sum.g = Math.round(sum.g / width);
        sum.b = Math.round(sum.b / width);

        return "rgb(" + sum.r + "," + sum.g + "," + sum.b + ")";
    } catch (e) {
        return "white";
    }
}

/* globals */
var weatheropened = 0,
    time = new Date(),
    appsopened = 0,
    bmopened = 0,
    optsopened = 0;

/* weather stuff */
var weatherFlashInterval;

function getWeather(icon) {
    document.getElementById("weatherprvw").style.backgroundImage = "url(" + icon + ")";
    document.getElementById("weatherprvw").style.display = "inline-block";
    document.getElementById("weatherprvw").onclick = function () {
        if (window.weatherFlashInterval) {
            clearInterval(weatherFlashInterval);
            this.style.backgroundImage = "url(" + icon + ")";
        }

        document.body.classList.toggle("weatheropened");
        
        document.getElementById("weatherframe").contentWindow.loadHeader();
    }
}

function startFlashing(urls) {
    var index = 0;
    weatherFlashInterval = setInterval(function () {
        document.getElementById("weatherprvw").style.backgroundImage = "url(" + urls[index] + ")";
        index++;
        if (index === urls.length) {
            index = 0;
        }
    }, 3000);
}

/* end weather stuff */

var settingsKeys = Object.keys(settings);

var defaultSlots = [{
    "icon": "/img/fb.png",
    "url": "http://www.facebook.com"
}, {
    "icon": "/img/ng.png",
    "url": "http://9gag.com"
}, {
    "icon": "/img/yt.png",
    "url": "http://www.youtube.com"
}, {
    "icon": "/img/rd.png",
    "url": "http://www.reddit.com"
}, {
    "icon": "/img/gp.png",
    "url": "https://plus.google.com"
}, {
    "icon": "/img/gg.png",
    "url": "https://www.google.com"
}, {
    "icon": "/img/yh.png",
    "url": "http://www.yahoo.com"
}, {
    "icon": "/img/pk.png",
    "url": "http://getpocket.com/a/queue/"
}, {
    "icon": "/img/tw.png",
    "url": "https://twitter.com"
}, {
    "icon": "/img/gd.png",
    "url": "https://drive.google.com"
}, {
    "icon": "/img/gk.png",
    "url": "https://drive.google.com/keep"
}, {
    "icon": "/img/vg.png",
    "url": "http://www.theverge.com"
}];

settings.apps = defaultSlots;

storage.get(settingsKeys, function (r) {
    var rKeys = Object.keys(r);
    for (i = 0; i < rKeys.length; i++) {
        settings[rKeys[i]] = r[rKeys[i]];
    }

    settingsKeys = Object.keys(settings);
    for (i = 0; i < settingsKeys.length; i++) {
        window[settingsKeys[i]] = settings[settingsKeys[i]]; // copy settings into global namespace (lazy laze, that's why)
        // so i dont have to do settings.foo every time
    }

    chrome.storage.local.get("backgroundURL", function (lr) {
        if (lr.backgroundURL !== undefined) {
            window.backgroundURL = lr.backgroundURL;
        }
        main();
    });
});

function main() {
    var bgElem = document.getElementById("bg");
    var whiteElem = document.getElementById("white");
    var container = document.getElementById("container");
    var drawer = document.getElementById("applist");

    bgElem.style.backgroundImage = backgroundURL || "url(/img/bg.png)";
    if (bgBlur) {
        bgElem.style.webkitFilter = "blur(20px)";
    }

    function openIconURL(iconElement) {
        white(iconElement, function(){
            chrome.tabs.update({url: iconElement.dataset.url});
        });
    }
    
    if (slotCount < 7) {		
        container.style.width = (appIconSize + 20) * slotCount + "px";
        container.style.height = (appIconSize + 20) + "px";
        container.style.marginTop = "-" + (appIconSize + 20) / 2 + "px";
    } else {		
        container.style.height = 2*(appIconSize + 20) + "px";
        container.style.marginTop = "-" + (appIconSize + 20) + "px";		
		
        container.style.width = Math.ceil(slotCount / 2) * (appIconSize + 20) + "px";		
    }		
    container.style.marginLeft = -parseInt(container.style.width) / 2 + "px";

    for (i = 0; i < slotCount; i++) {
        var thisApp = document.createElement("div");
        thisApp.classList.add("app");
        
        thisApp.addEventListener("click", function () {
            openIconURL(this);
        });
        
        thisApp.addEventListener("mouseenter", function () {
            positionWhite(this);
        });
        
        thisApp.style.width = appIconSize + "px";
        thisApp.style.height = appIconSize + "px";

        if (apps[i]) {
            thisApp.style.backgroundImage = "url(" + apps[i].icon + ")";
            thisApp.dataset.url = apps[i].url;
        } else { // not defined, go to defaults
            thisApp.style.backgroundImage = "url(" + defaultSlots[i].icon + ")";
            thisApp.dataset.url = defaultSlots[i].url;
        }

        document.getElementById("container").appendChild(thisApp);
    }

    document.getElementById("title").innerHTML = titleText;

    var searchFocusTimeout;

    document.getElementById("appbutton").onclick = function () {
        document.getElementById("drawer").style.top = "calc(100% - 70px)";

        this.style.opacity = "0";
        document.getElementById("optionbutton").style.opacity = "0";
        document.getElementById("bookmarks").style.opacity = "0";
        document.getElementById("appsicon").style.opacity = "0";
        document.getElementById("drawerarrow").style.opacity = "0";
        document.getElementById("bmarrow").style.opacity = "0";
        document.getElementById("search").value = "";

        searchFocusTimeout = setTimeout(function () {
            document.getElementById("search").focus();
        }, 200);
    };
    
    document.getElementById("close").onclick = function () {
        clearTimeout(searchFocusTimeout);

        document.getElementById("drawer").style.top = null;
        document.getElementById("appbutton").style.opacity = null;
        document.getElementById("bookmarks").style.opacity = null;
        document.getElementById("appsicon").style.opacity = null;

        document.getElementById("optionbutton").style.opacity = null;
        document.getElementById("drawerarrow").style.opacity = null;
        document.getElementById("bmarrow").style.opacity = null;
    };
    
    document.getElementById("search").onkeydown = function (e) {
        if (e.which === 13) {
            window.location = "https://www.google.com/search?q=" + encodeURI(this.value) + "&btnI";
        }
    };

    document.getElementById("optionbutton").onclick = function () {
        if (!options.src) { // it's the first time
            options.src = "options/options.html#iframe";
            options.contentWindow.onload = function () {
                this.easterEgg(); // this being the contentWindow
            };
        } else if (!optsopened && options.contentWindow.location.href.indexOf("options/options.html#iframe") !== -1) {
            options.contentWindow.easterEgg();
        }

        if (optsopened) {
            document.body.classList.remove("optsopened");
            optsopened = 0;
        } else {
            document.body.classList.add("optsopened");
            options.contentWindow.scrollTo(0, 0);
            optsopened = 1;
        }
    };

    if (showWeather) {
        var weatherIframe = document.createElement("iframe");
        weatherIframe.src = "weather/weather.html";
        weatherIframe.setAttribute("id", "weatherframe");
        document.body.appendChild(weatherIframe);
    }

    if (showFB) {
        document.getElementById("fbmsg").style.display = "inline-block";
        document.getElementById("fbmsg").onclick = function () {
            chrome.windows.create({
                url: "https://m.facebook.com/messages",
                width: 350,
                height: 500,
                focused: true,
                type: "panel"
            });
        };
    }

    if (showFBNotif) {
        document.getElementById("fbnotif").style.display = "inline-block";
        document.getElementById("fbnotif").onclick = function () {
            chrome.windows.create({
                url: "https://m.facebook.com/notifications.php",
                width: 350,
                height: 500,
                focused: true,
                type: "panel"
            });
        };
    }

    if (showStumble) {
        document.getElementById("stumble").style.display = "inline-block";
        document.getElementById("sidewipe").style.display = "block";
        document.getElementById("stumble").onclick = function () {
            window.location = "http://www.stumbleupon.com/to/stumble/go";
            document.getElementById("sidewipe").style.width = "100%";
        };
    }

    function getTopSites(res) {
        if (topSiteCount >= 1) {
            for (i = 0; i < topSiteCount; i++) {
                document.getElementById("topsites").innerHTML = document.getElementById("topsites").innerHTML + "<a href=" + res[i].url + "><div class=\"draweritem topsite\"id=l" + i + ">" + res[i].title + "</div></a>";
                document.getElementById("l" + i).style.backgroundImage = "url(http://www.google.com/s2/favicons?domain=" + res[i].url.getDomain() + ")";
            }
        } else {
            document.getElementById("mostvis").style.display = "none";
        }
    }

    function getApps(res) {
        var appsArray = [];

        for (i = 0; i < res.length; i++) {
            if ((res[i].type === "hosted_app" || res[i].type === "packaged_app" || res[i].type === "legacy_packaged_app") && res[i].enabled === true) {
                var appObject = {};
                appObject.name = res[i].name;
                appObject.id = res[i].id;
                appObject.icon = "chrome://extension-icon/" + appObject.id + "/128/0";
                appObject.clicks = Number(localStorage["app_clicks_" + appObject.id]) || 0;

                appsArray.push(appObject);
            }
        }

        appsArray.sort(function (a, b) {
            if (a.clicks === b.clicks) {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name < b.name) {
                    return -1;
                } else {
                    return 0;
                }
            }
            return b.clicks - a.clicks;
        });

        for (i = 0; i < appsArray.length - 1; i++) {
            var app = document.createElement("a");
            app.style.backgroundImage = "url(" + appsArray[i].icon + ")";
            app.classList.add("draweritem");
            app.classList.add("drawerapp");
            app.innerHTML = appsArray[i].name;
            app.dataset.id = appsArray[i].id;
            
            app.addEventListener("click", function(){
                if (localStorage["app_clicks_" + this.dataset.id]) {
                    localStorage["app_clicks_" + this.dataset.id] = Number(localStorage["app_clicks_" + this.dataset.id]) + 1;
                } else {
                    localStorage["app_clicks_" + this.dataset.id] = 1;
                }
                chrome.management.launchApp(this.dataset.id);
                if (autoClose) {
                    window.close();
                }
            });
            
            drawer.appendChild(app);
        }
    }

    if (showAppsDrawer) {
        chrome.topSites.get(getTopSites);
        chrome.management.getAll(getApps);
        document.getElementById("appsicon").style.display = "block";
        document.getElementById("appsicon").onclick = function () {
            if (!appsopened) {
                document.getElementById("appdrawerframe").classList.add("opened");
                document.getElementById("actualdrawer").scrollTop = 0;
                appsopened = 1;
                if (bmopened) {
                    document.getElementById("bookmarks").click();
                    bmopened = 0;
                }
            } else if (appsopened) {
                document.getElementById("appdrawerframe").classList.remove("opened");
                appsopened = 0;
            }
        }

        var appSearchBtn = document.getElementById("appsearchbtn");
        var appSearch = document.getElementById("appsearch");

        appSearchBtn.onclick = function () {
            document.getElementById("actualdrawer").classList.toggle("appsearch");

            if (document.getElementById("actualdrawer").classList.contains("appsearch")) {
                setTimeout(function () {
                    appSearch.focus();
                }, 200);
            }
        };

        appSearch.oninput = function () {
            var appElems = document.querySelectorAll(".drawerapp");
            for (i = 0; i < appElems.length; i++) {
                if (appElems[i].textContent.toLowerCase().indexOf(this.value.toLowerCase()) !== -1) {
                    appElems[i].classList.remove("hidden");
                } else {
                    appElems[i].classList.add("hidden");
                }
            }
        };
    }

    function getBookmarks(res) {
        document.getElementById("bookmarkslist").innerHTML = "";
        if (document.getElementById("bmsearch").value == "") {
            document.getElementById("bookmarkslist").innerHTML = "<div id='bmsearchtip'>Search for bookmarks and results will appear here</div>";
        } else if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].url.indexOf("javascript:") == -1 && res[i].url.indexOf("chrome://") == -1) {
                    document.getElementById("bookmarkslist").innerHTML = document.getElementById("bookmarkslist").innerHTML + "<a href=" + res[i].url + "><div class='bmsite' style='background-image:url(http://www.google.com/s2/favicons?domain=" + res[i].url.substring(0, res[i].url.indexOf("/", 9)) + ")'>" + res[i].title + "</div></a>";
                }
            }
        } else {
            document.getElementById("bookmarkslist").innerHTML = "<div id='bmsearchtip'>No search results :(</div>";
        }
    }

    function getAllBookmarks(res) {
        document.getElementById("bookmarkslist").innerHTML = "";
        if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].url.indexOf("javascript:") == -1) {
                    document.getElementById("bookmarkslist").innerHTML = document.getElementById("bookmarkslist").innerHTML + "<a href=" + res[i].url + "><div class=bmsite style=background-image:url(http://www.google.com/s2/favicons?domain=" + res[i].url.substring(0, res[i].url.indexOf("/", 9)) + ")>" + res[i].title + "</div></a>";
                }
            }
        } else {
            document.getElementById("bookmarkslist").innerHTML = "<div id='bmsearchtip'>No bookmarks :(</div>";
        }
    }

    if (showBookmarks) {
        document.getElementById("bookmarks").style.display = "block";
        document.getElementById("bookmarks").onclick = function () {
            if (!bmopened) {
                document.getElementById("bmdrawerframe").classList.add("opened");
                document.getElementById("bmsearch").value = "";
                chrome.bookmarks.search("", getBookmarks);

                bmopened = 1;

                if (appsopened) {
                    document.getElementById("appsicon").click();
                    appsopened = 0;
                }

                setTimeout(function () {
                    document.getElementById("bmsearch").focus()
                }, 200);
            } else if (bmopened) {
                document.getElementById("bmdrawerframe").classList.remove("opened");

                bmopened = 0;
            }
        }

        document.getElementById("bmsearch").onkeydown = function (e) {
            if (document.getElementById("bmsearch").value.length >= 3 || e.which == 13) {
                document.getElementById("bookmarkslist").scrollTop = 0;
                chrome.bookmarks.search(this.value, getBookmarks);
            }
        }

        if (showAllBookmarks) {
            setTimeout(function () {
                chrome.bookmarks.search("http", getAllBookmarks);
            }, 500);
        }
    }

    if (showNews && navigator.onLine) {
        var newsButton = document.getElementById("bbcnews");
        newsButton.style.display = "inline-block";
        var newsOpened = false;

        window.loadNews = function (res) {
            var newsEntries = res.responseData.feed.entries;
            for (i = 0; i < newsEntries.length; i++) {
                var newsItem = document.createElement("a");
                newsItem.innerHTML = newsEntries[i].title;
                newsItem.classList.add("news");
                newsItem.href = newsEntries[i].link;
                document.getElementById("newslist").appendChild(newsItem);
            }
        }

        // load bbc feed
        var bbcjson = document.createElement("script");
        bbcjson.src = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=20&callback=loadNews&q=http://feeds.bbci.co.uk/news/rss.xml";
        document.getElementsByTagName("head")[0].appendChild(bbcjson);

        newsButton.onclick = function () {
            if (newsOpened) {
                newsOpened = false;

                document.getElementById("newsdrawerframe").style.opacity = "0";
                document.getElementById("newsdrawerframe").style.height = "0";
                document.getElementById("newsarrow").style.opacity = "0";
            } else {
                newsOpened = true;

                document.getElementById("newsdrawerframe").style.opacity = "1";
                document.getElementById("newsdrawerframe").style.height = "450px";
                document.getElementById("newsarrow").style.opacity = "1";
            }
        }
    }

    if (showTumblr && navigator.onLine) {
        var tumbutton = document.getElementById("tumpost");

        tumbutton.style.display = "inline-block";

        tumbutton.onclick = function () {
            chrome.windows.create({
                url: "https://www.tumblr.com/share/text",
                focused: true,
                type: "panel"
            });
        }
    }

    setInterval(function () {
        window.scrollTo(0, 0);
    }, 100);
    
    function positionWhite(element) {
        var top = element.getClientRects()[0].top;
        var left = element.getClientRects()[0].left;
        var width = element.getClientRects()[0].width;
        var height = element.getClientRects()[0].height;

        var background = element.style.backgroundImage;
        var iconURL = background.substring(4, background.lastIndexOf(")"));
        
        whiteElem.style.top = top + "px";
        whiteElem.style.left = left + "px";
        whiteElem.style.width = width + "px";
        whiteElem.style.height = height + "px";
        whiteElem.style.backgroundColor = iconBGColor(iconURL);
    }

    function white(element, callback) {
        positionWhite(element);
        
        setTimeout(function(){
            whiteElem.style.opacity = "1";
            whiteElem.style.transitionDuration = "260ms";
            whiteElem.style.transitionProperty = "top, left, width, height, border-radius, background";
            whiteElem.style.top = "0";
            whiteElem.style.left = "0";
            whiteElem.style.height = "100%";
            whiteElem.style.width = "100%";
            whiteElem.style.zIndex = "5";
        });

        setTimeout(function(){
            whiteElem.style.backgroundColor = "white";
            whiteElem.style.borderRadius = "0";
        }, 50);
        
        setTimeout(function(){
            callback();
        }, 260);
    }

    if (noAnimation) {
        document.body.classList.add("noanimation");
    }
    
    (function(){
        var image = document.createElement("img");
        image.src = window.backgroundURL.substring(4, backgroundURL.lastIndexOf(")")); // grab "image.png" from "url(image.png)"
        image.onload = function(){ // if we do this before the background is loaded user will see a flash of black
            document.body.style.backgroundColor = "black";
        };
    })();
}

window.onerror = function (e) {
    prompt("Something went wrong. Please refresh the page and report this to the developer: '" + e + "'", "http://2shrt.co.nf/?nntp-bugreport");
};

if (navigator.userAgent.indexOf("Macintosh") === -1) {
    document.body.classList.add("customscrollbars");
}

console.log("\n\
8b  8                     8b  8                     88888      8       888b.                 \n\
8Ybm8 .d88b Yb  db  dP    8Ybm8 .d88b Yb  db  dP      8   .d88 88b.    8  .8 .d88 .d88 .d88b \n\
8  \"8 8.dP'  YbdPYbdP     8  \"8 8.dP'  YbdPYbdP       8   8  8 8  8    8wwP' 8  8 8  8 8.dP' \n\
8   8 `Y88P   YP  YP      8   8 `Y88P   YP  YP        8   `Y88 88P'    8     `Y88 `Y88 `Y88P \n\
                                                                                  wwdP       \n\
\n(C) 2013-2014 Zachary Guard\n\
\nif (you.isDeveloper()) {\n\
    goto('http://github.com/z-------------/New-New-Tab-Page');\n\
    contribute();\n\
}\n");