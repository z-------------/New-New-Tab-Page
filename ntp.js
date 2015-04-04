var storage = chrome.storage.sync;

var settings = {
    slotCount: 3,
    appIconSize: 130,
    showAppsDrawer: true,
    topSiteCount: 6,
    recSiteCount: 3,
    showBookmarks: false,
    showAllBookmarks: false,
    firstRun: false,
    backgroundURL: "url(/img/bg.png)",
    bgBlur: false,
    disableAnimation: false,
    titleText: "New Tab",
    showFB: false,
    showFBNotif: false,
    showStumble: false,
    autoClose: true,
    showTumblr: false,
    apps: [],
    noAnimation: false
};

var xhr = function(url,callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function(){
        var response = this.responseText;
        callback(response);
    };
    oReq.open("get", url, true);
    oReq.send();
};

String.prototype.getDomain = function () {
    var temp = document.createElement("a");
    temp.href = this;
    return temp.protocol + "//" + temp.host;
};

String.prototype.getPureDomain = function () {
    var temp = document.createElement("a");
    temp.href = this;
    
    var val = temp.host;
    if (val.indexOf("www") === 0) val = val.substring(val.indexOf("www.") + "www.".length);
    
    return val;
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
    optsopened = 0,
    sidebarMouseInterval,
    sidebarMouseTime = 0;

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

var urlIconMap = {
    "facebook.com": "fb",
    "plus.google.com": "gp",
    "youtube.com": "yt",
    "9gag.com": "ng",
    "mail.google.com": "gmail",
    "reddit.com": "rd",
    "google.com": "gg",
    "yahoo.com": "yh",
    "drive.google.com": "gd",
    "digg.com": "dg",
    "theverge.com": "vg",
    "twitter.com": "tw",
    "getpocket.com": "pk",
    "keep.google.com": "gk",
    "inbox.google.com": "ix",
    "ello.co": "el",
    "^[\S]+.slack.com|slack.com": "sk"
};

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
    var sidebar = document.querySelector("#sidebar");

    bgElem.style.backgroundImage = backgroundURL || "url(/img/bg.png)";
    if (bgBlur) {
        bgElem.style.webkitFilter = "blur(20px)";
    }

    function openIconURL(iconElement) {
        if (!document.querySelector("#apps-editor-container.opened")) {
            white(iconElement, function(){
                chrome.tabs.update({url: iconElement.dataset.url});
            });
        }
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
    
    window.openAppsEditor = function(){
        var editorContainer = document.querySelector("#apps-editor-container");
        var editorElem = document.querySelector("#apps-editor");
        var editorBtnsElem = document.querySelector("#apps-editor-buttons");
        editorContainer.classList.add("opened");
        
        var urlInput = document.querySelector("#editor-url");
        var iconInput = document.querySelector("#editor-icon");
        var iconFileInput = document.querySelector("#editor-icon-file");
        var fetchIconBtn = document.querySelector("#editor-fetchicon");
        var saveBtn = document.querySelector("#editor-save");
        var cancelBtn = document.querySelector("#editor-cancel");
        var closeBtn = document.querySelector("#editor-closeeditor");
        
        var appElems = document.querySelectorAll(".app");
        
        function fetchIcon(url, callback) {
            var presetMatchedId;
            
            Object.keys(urlIconMap).forEach(function(regex){
                if (new RegExp(regex).test(url.getPureDomain())) {
                    presetMatchedId = urlIconMap[regex];
                }
            });
            
            if (presetMatchedId) {
                callback("/img/" + presetMatchedId + ".png");
            } else {
                xhr(url, function(r){
                    console.log(r);

                    parser = new DOMParser();
                    doc = parser.parseFromString(r, "text/html");
                    console.log(doc);
                    var linkTags = doc.head.querySelectorAll("link");
                    var icons = [].slice.call(linkTags).filter(function(tag){
                        var isAppleIcon = (tag.getAttribute("rel") === "apple-touch-icon-precomposed" || tag.getAttribute("rel") === "apple-touch-icon");
                        return isAppleIcon;
                    });
                    var icon;
                    if (icons.length > 0) icon = icons[0].href;

                    callback(icon);
                });
            }
        }
        
        function updateApp(index, key, value) {
            apps[index][key] = value;
            
            if (key === "url") {
                appElems[index].dataset.url = value;
            }
            if (key === "icon") {
                appElems[index].style.backgroundImage = "url(" + value + ")";
            }
        }
        
        function saveApps() {
            storage.set({apps: apps}, function(){
                location.reload();
            });
        }
        
        function positionEditor(appElem) {
            editorElem.style.left = container.offsetLeft + appElem.offsetLeft + appElem.offsetWidth / 2 - editorElem.offsetWidth / 2 + "px";
            editorElem.style.top = container.offsetTop + appElem.offsetTop - editorElem.offsetHeight - 20 + "px";
        }
        
        function positionEditorBtns() {
            editorBtnsElem.style.left = container.offsetLeft + "px";
            editorBtnsElem.style.top = container.offsetTop - editorBtnsElem.offsetHeight + "px";
            editorBtnsElem.style.width = container.offsetWidth + "px";
        }
        
        function editApp(appElem) {
            appElem.classList.add("editing");
            
            var index = [].slice.call(appElems).indexOf(appElem);
            
            [].slice.call(appElems).forEach(function(elem){
                if (elem !== appElem) elem.classList.remove("editing");
            });
            
            urlInput.value = apps[index].url;
            iconInput.value = apps[index].icon;
            
            urlInput.onchange = function(){
                updateApp(index, "url", this.value);
            };
            
            iconInput.onchange = function(){
                updateApp(index, "icon", this.value);
            };
            
            fetchIconBtn.onclick = function(){
                fetchIcon(apps[index].url, function(r){
                    if (r) {
                        iconInput.value = r;
                        iconInput.dispatchEvent(new Event("change"));
                    }
                });
            }
            
            editorElem.style.display = "block";
            
            positionEditor(appElem);
            positionEditorBtns();
        }
        
        [].slice.call(appElems).forEach(function(elem){
            elem.onclick = function(){
                editApp(this);
            };
        });
        
        saveBtn.onclick = saveApps;
        cancelBtn.onclick = function(){
            location.reload();
        };
        
        closeBtn.onclick = function(){
            document.querySelector(".app.editing").classList.remove("editing");
            editorElem.style.display = "none";
        };
        
        window.addEventListener("resize", function(){
            positionEditor(document.querySelector(".app.editing"));
            positionEditorBtns();
        });
        
        editApp(appElems[0]);
    };

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
    
    function getRecentSites(res) {
        if (recSiteCount >= 1 && res.length >= 1) {
            for (var i = 0; i < Math.min(recSiteCount, res.length); i++) {
                var recSite = res[i].tab;
                
                var recentSitesList = document.getElementById("recentsites");
                
                var recSiteElem = document.createElement("a");
                recSiteElem.href = recSite.url;
                recSiteElem.innerHTML = "<div class='draweritem topsite' id='l" + i + "'>" + recSite.title + "</div>";
                
                recSiteElem.querySelector("div").style.backgroundImage = "url(" + recSite.favIconUrl + ")";
                
                recentSitesList.appendChild(recSiteElem);
            }
        } else {
            document.getElementById("recmostvis").style.display = "none";
        }
    }

    function getTopSites(res) {
        if (topSiteCount >= 1) {
            for (i = 0; i < topSiteCount; i++) {
                document.getElementById("topsites").innerHTML = document.getElementById("topsites").innerHTML + "<a href=" + res[i].url + "><div class=\"draweritem topsite\"id=l" + i + ">" + res[i].title + "</div></a>";
                document.getElementById("l" + i).style.backgroundImage = "url(http://www.google.com/s2/favicons?domain=" + res[i].url.getDomain() + ")";
            }
        } else {
            document.getElementById("topmostvis").style.display = "none";
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
        chrome.sessions.getRecentlyClosed(getRecentSites);
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
    
    /* sidebar stuff */
    
    var sidebarFirstTime = true;
    
    var sidebarOnFirstOpen = function(){
        /* weather */
        sidebar.querySelector("#weatherdiv").innerHTML = "<iframe id='weatherframe' src='weather/weather.html'></iframe>";
        
        /* news */
        if (navigator.onLine) {
            var yqlQuery = "select title,link,description,thumbnail,pubDate from rss where url = 'http://feeds.bbci.co.uk/news/world/rss.xml'";
            xhr("https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yqlQuery) + "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(res){
                var newsEntries = JSON.parse(res).query.results.item.filter(function(e, i){return i % 2 !== 0});
                for (i = 0; i < newsEntries.length; i++) {
                    var newsItem = document.createElement("li");

                    newsItem.innerHTML = "<a target='_blank' href='" + newsEntries[i].link + "'><h3>" + newsEntries[i].title + "</h3></a><div class='news-content'><div class='news-thumb' style='background-image:url(" + newsEntries[i].thumbnail.url +  ")'></div><div class='news-text'><p>" + newsEntries[i].description + "</p><date>" + new Date(newsEntries[i].pubDate).toLocaleTimeString() + "</date></div></div>";
                    newsItem.classList.add("news");

                    document.getElementById("newslist").appendChild(newsItem);
                }
                document.getElementById("newslist").classList.remove("loading");
            });

            document.getElementById("newslist").classList.add("loading");
        } else {
            document.getElementById("newslist").innerHTML = "<p>You are offline ;_;</p>";
        }
        
        /* facebook */
        if (showFBNotif) {
            addToSidebar("fb-notif", "<iframe class='fb-frame' id='fb-notif-frame' src='https://nntp-guardo.rhcloud.com/fb/notif/'></iframe>");
        }

        if (showFB) {
            addToSidebar("fb-msg", "<iframe class='fb-frame' id='fb-msg-frame' src='https://nntp-guardo.rhcloud.com/fb/msg/'></iframe>");
        }
        
        /* init navigation */
        var sidebarNavElems = document.querySelectorAll("#sidebar nav a");
        
        [].slice.call(sidebarNavElems).forEach(function(sidebarNavElem, i){
            if (i === 0) {
                changeSidebarSection(sidebarNavElem.dataset.target);
            }
            sidebarNavElem.addEventListener("click", function(){
                changeSidebarSection(this.dataset.target);
            });
        });
    };
    
    function toggleSidebar(direction){
        if (direction === null || typeof direction === "undefined") {
            if (document.body.classList.contains("sidebar-opened")) {
                direction = 0;
            } else {
                direction = 1;
            }
        }
        
        var methods = ["remove", "add"];
        var method = methods[direction];
        
        document.body.classList[method]("sidebar-opened");
        
        if (direction === 1 && sidebarFirstTime) {
            sidebarOnFirstOpen();
        }
        
        if (direction === 1) sidebarFirstTime = false;
    }
    
    function addToSidebar(id, content) {
        /* make nav elem */
        var navElem = document.createElement("a");
        navElem.dataset.target = id;
        sidebar.querySelector("nav").appendChild(navElem);
        
        /* make section elem */
        var sectionElem = document.createElement("section");
        sectionElem.innerHTML = content;
        sectionElem.dataset.id = id;
        sidebar.appendChild(sectionElem);
    }
    
    document.querySelector("#sidebar-btn").addEventListener("click", function(){
        toggleSidebar();
    });

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
    
    /* sidebar navigation */
    
    function changeSidebarSection(id){
        var targetSection = sidebar.querySelector("section[data-id='" + id + "']");
        var targetLink = sidebar.querySelector("nav [data-target='" + id + "']");
        var sections = sidebar.querySelectorAll("section[data-id]");
        var links = sidebar.querySelectorAll("nav [data-target]");
        
        for (var i = 0; i < sections.length; i++) {
            sections[i].classList.remove("current");
            links[i].classList.remove("current");
        }
        
        targetSection.classList.add("current");
        targetLink.classList.add("current");
    }
    
    /* open sidebar when mouse on right edge */
    window.addEventListener("mousemove", function(e){
        clearInterval(sidebarMouseInterval);
        if (Math.abs(e.clientX - window.innerWidth) <= 5) {
            sidebarMouseTime = 0;
            sidebarMouseInterval = setInterval(function(){
                sidebarMouseTime += 1;
                if (sidebarMouseTime >= 50) {
                    toggleSidebar(1);
                }
            });
        }
    });
    
    bgElem.addEventListener("click", function(){
        toggleSidebar(0);
    });
}

window.onerror = function (e) {
    console.log("Something went wrong.", e, "Please refresh the page and report the problem to the developer: http://2shrt.co.nf/?nntp-bugreport");
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
\n(C) 2013-2015 Zachary Guard\n\
\nif (you.isDeveloper()) {\n\
    goto('http://github.com/z-------------/New-New-Tab-Page');\n\
    contribute();\n\
}\n");