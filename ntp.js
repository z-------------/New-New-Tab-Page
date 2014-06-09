function white() {
    document.getElementById("white").setAttribute("style","top:0;left:0;height:100%;width:100%;opacity:1;");
}
var weatheropened = 0,
    time = new Date(),
    appsopened = 0,
    bmopened = 0,
    optsopened = 0;
    
function getWeather(icon) {
    document.getElementById("weatherprvw").style.backgroundImage = "url("+icon+")";
    document.getElementById("weatherprvw").style.display = "inline-block";
    document.getElementById("weatherprvw").onclick = function(){
        if (!weatheropened) {
            document.getElementById("weatherframe").style.left = "50%";
            document.getElementById("weatherframe").style.opacity = "1";
            document.body.classList.add("weatheropened");
            weatheropened = 1;
        } else if (weatheropened) {
            document.getElementById("weatherframe").style.left = "150%";
            document.getElementById("weatherframe").style.opacity = "0"
            document.body.classList.remove("weatheropened");
            weatheropened = 0;
        }
    }
}

function startFlashing(urls) {
    //document.getElementById("weatherprvw").style.webkitAnimation = "weatherFlash 1s infinite";
    var index = 0;
    setInterval(function(){
        document.getElementById("weatherprvw").style.backgroundImage = "url("+urls[index]+")";
        index++;
        if (index == urls.length) {
            index = 0;
        }
    },2000);
}

var defaultSlots = [
    ["fb","http://www.facebook.com"],
    ["ng","http://9gag.com"],
    ["yt","http://www.youtube.com"],
    ["rd","http://www.reddit.com"],
    ["gp","https://plus.google.com"],
    ["gg","https://www.google.com"],
    ["yh","http://www.yahoo.com"],
    ["pk","http://getpocket.com/a/queue/"],
    ["tw","https://twitter.com"],
    ["gd","https://drive.google.com"],
    ["gk","https://drive.google.com/keep"],
    ["vg","http://www.theverge.com"]
]

var slotcount = localStorage.slotcount || "3",
    bgblur = localStorage.bgblur || "false",
    showAppsDrawer = localStorage.showappdrawer || "true";
    if (localStorage.topsitecount == null) {
        var topsitecount = 6;
    } else if (localStorage.topsitecount == "0"){
        var topsitecount = 0;
    } else {
        var topsitecount = parseInt(localStorage.topsitecount);
    }
    showBookmarks = localStorage.showbookmarks || "false";
document.addEventListener("DOMContentLoaded",function(){
    if (localStorage.firstRun != "false") {
        window.location = "welcome.html";
    }
    
    document.getElementById("bg").style.backgroundImage = localStorage.backgroundURL || "url(/img/bg.png)";
    
    if (localStorage.bgblur == "true") {
        document.getElementById("bg").setAttribute("style",document.getElementById("bg").getAttribute("style")+"-webkit-filter:blur(20px)");
    }
    var container = document.getElementById("container");
    
    if (slotcount == 3) {
        container.style.width = "450px";
        container.style.marginLeft = "-225px";
    } else if (slotcount == 4) {
        container.style.width = "600px";
        container.style.marginLeft = "-300px";
    } else if (slotcount == 5) {
        container.style.width = "750px";
        container.style.marginLeft = "-375px";
    } else if (slotcount == 6) {
        container.style.width = "900px";
        container.style.marginLeft = "-450px";
    } else if (slotcount == 7 || slotcount == 8) {
        container.style.width = "600px";
        container.style.height = "300px";
        container.style.marginLeft = "-300px";
        container.style.marginTop = "-150px";
    } else if (slotcount == 9 || slotcount == 10) {
        container.style.width = "750px";
        container.style.height = "300px";
        container.style.marginLeft = "-375px";
        container.style.marginTop = "-150px";
    } else if (slotcount == 11 || slotcount == 12) {
        container.style.width = "900px";
        container.style.height = "300px";
        container.style.marginLeft = "-450px";
        container.style.marginTop = "-150px";
    }
    
    function openIconURL(iconElement) {
        window.location = iconElement.getAttribute("data-url");
        if (eval(localStorage.disableanimation) != true) {
            white();
        }
    }
    
    for (i=0;i<slotcount;i++) {
        var _thisApp = document.createElement("div");
        _thisApp.classList.add("app");
        _thisApp.addEventListener("click",function(){
            openIconURL(this);
        })
        if (localStorage["slot"+(i+1)+"usec"] == "true") { // if custom app
            _thisApp.style.backgroundImage = "url("+localStorage["slot"+(i+1)+"ic"]+")";
            _thisApp.classList.add("cust");
            _thisApp.setAttribute("data-url",localStorage["slot"+(i+1)+"uc"]);
        } else if (!localStorage["slot"+(i+1)+"i"]) { // not defined, go to defaults
            _thisApp.setAttribute("id",defaultSlots[i][0]);
            _thisApp.setAttribute("data-url",defaultSlots[i][1]);
        } else { // normal app
            _thisApp.setAttribute("id",localStorage["slot"+(i+1)+"i"]);
            _thisApp.setAttribute("data-url",localStorage["slot"+(i+1)+"u"]);
        }
        document.getElementById("container").appendChild(_thisApp);
    }
    
    if (localStorage.titletext) {
        document.getElementById("title").innerHTML = localStorage.titletext;
    }
    
    document.getElementById("appbutton").onclick = function(){
        document.getElementById("search").style.display = "block";
        document.getElementById("drawer").style.top = "calc(100% - 70px)";
        
        this.style.opacity = "0";
        document.getElementById("optionbutton").style.opacity = "0";
        document.getElementById("bookmarks").style.opacity = "0";
        document.getElementById("appsicon").style.opacity = "0";
        document.getElementById("drawerarrow").style.opacity = "0";
        document.getElementById("bmarrow").style.opacity = "0";
        
        setTimeout(function(){
            document.getElementById("search").focus();
        },200);
    }
    document.getElementById("close").onclick = function(){
        setTimeout(function(){
            document.getElementById("search").style.display = "none";
        },500);
        document.getElementById("drawer").style.top = "100%";
        document.getElementById("appbutton").style.opacity = "1";
        document.getElementById("bookmarks").style.opacity = "1";
        document.getElementById("appsicon").style.opacity = "1";
        
        document.getElementById("optionbutton").style.opacity = "1";
        document.getElementById("drawerarrow").style.opacity = "1";
        document.getElementById("bmarrow").style.opacity = "1";
        document.getElementById("search").value = "";
    }
    document.getElementById("search").onkeydown = function(e){
        if (e.which == 13) {
            window.location = "https://www.google.com/search?q="+encodeURI(this.value)+"&btnI";
        }
    }
    document.getElementById("search").onwebkitspeechchange = function(){
        window.location = "https://www.google.com/search?q="+encodeURI(this.value)+"&btnI";
    }
    document.getElementById("optionbutton").onclick = function(){
        if (optsopened) {
            document.body.classList.remove("optsopened");
            optsopened = 0;
        } else {
            document.body.classList.add("optsopened");
            optsopened = 1;
        }
    }
    
    if (localStorage.showWeather == "true") {
        var weatherIframe = document.createElement("iframe");
        weatherIframe.src = "weather.html";
        weatherIframe.setAttribute("id","weatherframe");
        document.body.appendChild(weatherIframe);
    }
    
    if (localStorage.showFb == "true") {
        document.getElementById("fbmsg").style.display = "inline-block";
        document.getElementById("fbmsg").onclick = function(){
            chrome.windows.create({url:"https://m.facebook.com/messages",width:350,height:500,focused:true,type:"panel"});
        }
    }
    if (localStorage.showNotif == "true") {
        document.getElementById("fbnotif").style.display = "inline-block";
        document.getElementById("fbnotif").onclick = function(){
            chrome.windows.create({url:"https://m.facebook.com/notifications.php",width:350,height:500,focused:true,type:"panel"});
        }
    }
    if (localStorage.showStumble == "true") {
        document.getElementById("stumble").style.display = "inline-block";
        document.getElementById("sidewipe").style.display = "block";
        document.getElementById("stumble").onclick = function(){
            window.location = "http://www.stumbleupon.com/to/stumble/go";
            document.getElementById("sidewipe").style.width = "100%";
        }
    }
    function getTopSites(res) {
        if (topsitecount >= 1) {
            for (var i=0;i<topsitecount;i++) {
                document.getElementById("topsites").innerHTML = document.getElementById("topsites").innerHTML + "<a href="+res[i].url+"><div class=\"draweritem topsite\"id=l"+i+">"+res[i].title+"</div></a>";
                document.getElementById("l"+i).style.backgroundImage = "url(http://www.google.com/s2/favicons?domain=" + res[i].url.substring(0,res[i].url.indexOf("/",9)) + ")";
            }
        } else {
            document.getElementById("mostvis").style.display = "none";
        }
    }
    
    Array.prototype.vSort = function(sortKey,sortFunction) {
        var array = this;
        switch (sortFunction) {
            case "number-asc":
                return array.sort(function(a, b){
                    return a[sortKey]-b[sortKey];
                });
                break;
            case "number-desc":
                return array.sort(function(a, b){
                    return b[sortKey]-a[sortKey];
                });
                break;
            case "alpha-desc":
                return array.sort(function(a,b){
                    if(a[sortKey].toLowerCase() < b[sortKey].toLowerCase()) return 1;
                    if(a[sortKey].toLowerCase() > b[sortKey].toLowerCase()) return -1;
                    return 0;
                });
                break;
            default:
                return array.sort(function(a,b){
                    if(a[sortKey].toLowerCase() < b[sortKey].toLowerCase()) return -1;
                    if(a[sortKey].toLowerCase() > b[sortKey].toLowerCase()) return 1;
                    return 0;
                });
                break;
        }
    }
    
    function getApps(res) {
        var appsArray = [];
        for (i in res) {
            if ((res[i].type == "hosted_app" || res[i].type == "packaged_app" || res[i].type == "legacy_packaged_app") && res[i].enabled == true) {
                var appObject = {};
                appObject.name = res[i].name;
                appObject.id = res[i].id;
                appObject.icon = "chrome://extension-icon/"+appObject.id+"/128/0";
                appObject.clicks = parseInt(localStorage["app_clicks_"+appObject.id]) || 0;
                
                appsArray.push(appObject);
            }
        }
        appsArray.vSort("clicks","number-desc");
        
        for (i=0;i<appsArray.length-1;i++) {
            var drawer = document.getElementById("applist");
            var _app = document.createElement("a");
            _app.style.backgroundImage = "url("+appsArray[i].icon+")";
            _app.classList.add("draweritem");
            _app.classList.add("drawerapp");
            _app.innerHTML = appsArray[i].name;
            _app.setAttribute("data-app-id",appsArray[i].id);
            _app.onclick = function(){
                if (localStorage["app_clicks_"+this.getAttribute("data-app-id")]) {
                    localStorage["app_clicks_"+this.getAttribute("data-app-id")]++;
                } else {
                    localStorage["app_clicks_"+this.getAttribute("data-app-id")] = 1;
                }
                chrome.management.launchApp(this.getAttribute("data-app-id"));
                if (localStorage.autoclose != "false") {
                    window.close();
                }
            }
            drawer.appendChild(_app);
        }
    }
    if (showAppsDrawer == "true") {
        chrome.topSites.get(getTopSites);
        chrome.management.getAll(getApps);
        document.getElementById("appsicon").style.display = "block";
        document.getElementById("appsicon").onclick = function(){
            if (!appsopened) {
                document.getElementById("appdrawerframe").setAttribute("style","opacity:1;height:450px;");
                document.getElementById("drawerarrow").setAttribute("style","opacity:1;");
                appsopened = 1;
                if (bmopened) {
                    document.getElementById("bookmarks").click();
                    bmopened = 0;
                }
            } else if (appsopened) {
                document.getElementById("appdrawerframe").setAttribute("style","opacity:0;height:0;");
                document.getElementById("drawerarrow").setAttribute("style","opacity:0;");
                appsopened = 0;
            }
        }
    }
    function getBookmarks(res){
        document.getElementById("bookmarkslist").innerHTML = "";
        if (document.getElementById("bmsearch").value == "") {
            document.getElementById("bookmarkslist").innerHTML = "<div id=bmsearchtip>You're doing it wrong... type something in the search box</div>";
        } else if (res.length > 0) {
            for (var i=0;i<res.length;i++){
                if (res[i].url.indexOf("javascript:") == -1 && res[i].url.indexOf("chrome://") == -1) {
                    document.getElementById("bookmarkslist").innerHTML = document.getElementById("bookmarkslist").innerHTML + "<a href="+res[i].url+"><div class=bmsite style=background-image:url(http://www.google.com/s2/favicons?domain="+res[i].url.substring(0,res[i].url.indexOf("/",9))+")>"+res[i].title+"</div></a>";
                }
            }
        } else {
            document.getElementById("bookmarkslist").innerHTML = "<div id=bmsearchtip>No search results :(</div>";
        }
    }
    function getAllBookmarks(res){
        document.getElementById("bookmarkslist").innerHTML = "";
        if (res.length > 0) {
            for (var i=0;i<res.length;i++){
                if (res[i].url.indexOf("javascript:") == -1) {
                    document.getElementById("bookmarkslist").innerHTML = document.getElementById("bookmarkslist").innerHTML + "<a href="+res[i].url+"><div class=bmsite style=background-image:url(http://www.google.com/s2/favicons?domain="+res[i].url.substring(0,res[i].url.indexOf("/",9))+")>"+res[i].title+"</div></a>";
                }
            }
        } else {
            document.getElementById("bookmarkslist").innerHTML = "<div id=bmsearchtip>No bookmarks :(</div>";
        }
    }
    if (showBookmarks == "true") {
        document.getElementById("bookmarks").style.display = "block";
        document.getElementById("bookmarks").onclick = function(){
            if (!bmopened) {
                document.getElementById("bmdrawerframe").style.opacity = "1";
                document.getElementById("bmdrawerframe").style.height = "450px";
                document.getElementById("bmarrow").style.opacity = "1";
                
                bmopened = 1;
                if (appsopened) {
                    document.getElementById("appsicon").click();
                    appsopened = 0;
                }
                setTimeout(function(){document.getElementById("bmsearch").focus()},200);
            } else if (bmopened) {
                document.getElementById("bmdrawerframe").style.opacity = "0";
                document.getElementById("bmdrawerframe").style.height = "0";
                document.getElementById("bmarrow").style.opacity = "0";
                
                bmopened = 0;
            }
        }
        document.getElementById("bmsearch").onkeydown = function(e){
            if (document.getElementById("bmsearch").value.length >= 3 || e.which == 13) {
                document.getElementById("bookmarkslist").scrollTop = 0;
                chrome.bookmarks.search(this.value,getBookmarks);
            }
        }
        document.getElementById("bmsearch").onwebkitspeechchange = function(){
            chrome.bookmarks.search(this.value,getBookmarks);
        }
        if (localStorage.showAllBookmarks == "true") {
            setTimeout(function(){
                chrome.bookmarks.search("http",getAllBookmarks);
            },500);
        }
    }
    window.onkeydown = function(e){
        if (e.which == 70 && !bmopened) {
            document.getElementById("appbutton").click();
        }
    }
    var showNews = eval(localStorage.shownews) || false;
    
    if (showNews && navigator.onLine) {
        var newsButton = document.getElementById("bbcnews");
        newsButton.style.display = "inline-block";
        var newsOpened = false;
        
        window.loadNews = function(res) {
            var newsEntries = res.responseData.feed.entries;
            for (i=0;i<newsEntries.length;i++) {
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
        
        newsButton.onclick = function(){
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
    
    var showTum = eval(localStorage.showtum) || false;
    
    if (showTum) {
        var tumbutton = document.getElementById("tumpost");
        
        tumbutton.style.display = "inline-block";
        
        tumbutton.onclick = function(){
            chrome.windows.create({url:"https://www.tumblr.com/share/text",focused:true,type:"panel"});
        }
    }
    
    setInterval(function(){
        window.scrollTo(0,0);
    },100);
});
window.onerror = function(){
    alert("Something went wrong. Please refresh the page and report this error to the developer");
}
console.log("\n\
8b  8                     8b  8                     88888      8       888b.                 \n\
8Ybm8 .d88b Yb  db  dP    8Ybm8 .d88b Yb  db  dP      8   .d88 88b.    8  .8 .d88 .d88 .d88b \n\
8  \"8 8.dP'  YbdPYbdP     8  \"8 8.dP'  YbdPYbdP       8   8  8 8  8    8wwP' 8  8 8  8 8.dP' \n\
8   8 `Y88P   YP  YP      8   8 `Y88P   YP  YP        8   `Y88 88P'    8     `Y88 `Y88 `Y88P \n\
                                                                                  wwdP       ",
"\n(C) 2014 Zachary Guard","\nContribute to the open source project at https://github.com/z-------------/New-New-Tab-Page");
