function white() {
    document.getElementById("white").setAttribute("style","top:0;left:0;height:100%;width:100%;opacity:1;");
}
var weatheropened = 0,
    time = new Date(),
    appsopened = 0,
    bmopened = 0,
    optsopened = 0;
function getWeather(response) {
    if(response) {
        var weather = window.top.iconWea;
        if (weather == "Clear" && time.getHours() < 18 && time.getHours() >= 6) {
            icon = "sunny";
        } else if (weather == "Clear") {
            icon = "moon";
        } else if (weather.indexOf("Storm") > -1 || weather.indexOf("storm") > -1) {
            icon = "storm";
        } else if (weather.indexOf("Rain") > -1 || weather.indexOf("Shower") > -1 || weather.indexOf("Drizzle") > -1){
            icon = "rain";
        } else if (weather.indexOf("Fog") > -1 || weather.indexOf("Haz") > -1 || weather.indexOf("Part") > -1) {
            icon = "fog";
        } else if (weather.indexOf("Cloud") > -1 || weather == "Overcast") {
            icon = "cloudy";
        } else if (weather.indexOf("Snow") > -1 || weather.indexOf("Hail") > -1) {
            icon = "snow";
        } else {
            icon = "sunny";
        }
        document.getElementById("weatherprvw").style.backgroundImage = "url(img/weather/"+icon+".png)";
        document.getElementById("weatherprvw").setAttribute("style",document.getElementById("weatherprvw").getAttribute("style")+"opacity:1;");
    }
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
    bgopt = localStorage.bgopt || "bg",
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
    if (localStorage.usecustombg !== "true") {
        document.getElementById("bg").style.backgroundImage = "url(img/"+bgopt+".png)";
    } else {
        document.getElementById("bg").style.backgroundImage = "url("+localStorage.custombg+")";
    }
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
    if (localStorage.showWeather == "true") {
        document.getElementById("weatherprvw").style.display = "inline-block";
        document.body.innerHTML = document.body.innerHTML + "<iframe id=weatherframe src=weather.html></iframe>";
        document.getElementById("weatherprvw").onclick = function(){
            if (!weatheropened) {
                document.getElementById("weatherframe").style.left = "50%";
                document.getElementById("weatherframe").setAttribute("style",document.getElementById("weatherframe").getAttribute("style")+"opacity:1;");
                weatheropened = 1;
            } else if (weatheropened) {
                document.getElementById("weatherframe").style.left = "150%";
                setTimeout(function(){document.getElementById("weatherframe").setAttribute("style",document.getElementById("weatherframe").getAttribute("style")+"opacity:0;")},200);
                weatheropened = 0;
            }
        }
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
        document.getElementById("drawer").style.bottom = "0";
        this.setAttribute("style","opacity:0");
        document.getElementById("optionbutton").setAttribute("style","opacity:0;");
        document.getElementById("bookmarks").setAttribute("style",document.getElementById("bookmarks").getAttribute("style")+"opacity:0;");
        document.getElementById("appsicon").setAttribute("style",document.getElementById("appsicon").getAttribute("style")+"opacity:0;");
        document.getElementById("drawerarrow").setAttribute("style","opacity:0;");
        document.getElementById("bmarrow").setAttribute("style",document.getElementById("bmarrow").getAttribute("style")+"opacity:0;");
        setTimeout(function(){document.getElementById("search").focus()},200);
    }
    document.getElementById("close").onclick = function(){
        setTimeout(function(){document.getElementById("search").style.display = "none"},200);
        document.getElementById("drawer").style.bottom = "-70px";
        document.getElementById("appbutton").setAttribute("style","opacity:1;");
        document.getElementById("bookmarks").setAttribute("style",document.getElementById("bookmarks").getAttribute("style")+"opacity:1;");
        document.getElementById("appsicon").setAttribute("style",document.getElementById("appsicon").getAttribute("style")+"opacity:1;");
        document.getElementById("optionbutton").setAttribute("style","opacity:1;");
        document.getElementById("drawerarrow").setAttribute("style","opacity:1;");
        document.getElementById("bmarrow").setAttribute("style",document.getElementById("bmarrow").getAttribute("style")+"opacity:1;");
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
        if (!optsopened) {
            document.getElementById("options").style.opacity = "1";
            document.getElementById("options").style.top = "50%";
            for (var i=0;i<document.getElementsByClassName("app").length;i++) {
                document.getElementsByClassName("app")[i].style.opacity = "0";
            }
            optsopened = 1;
        } else {
            document.getElementById("options").style.opacity = "0";
            document.getElementById("options").style.top = "150%";
            for (var i=0;i<document.getElementsByClassName("app").length;i++) {
                document.getElementsByClassName("app")[i].style.opacity = "1";
            }
            optsopened = 0;
        }
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
    function getApps(res) {
        appsObject = {};
        for (var i=0;i<res.length;i++){
            if (res[i].type == "hosted_app" || res[i].type == "packaged_app") {
                appsObject[res[i].name] = {name:res[i].name,id:res[i].id,url:res[i].appLaunchUrl}
            }
        }
        keys = Object.keys(appsObject).sort();
        window.onclick = function(){
            setTimeout(function(){
                if (window.location.hash.length > 1) {
                    var appid = location.hash.substring(1,location.hash.length);
                    chrome.management.launchApp(appid);
                    location.hash = "";
                }
            },1)
        }
        for (i=0;i<keys.length;i++) {
            var drawer = document.getElementById("applist"),
                thisapplink = document.createElement("a");
            thisapplink.style.backgroundImage = "url(chrome://extension-icon/"+appsObject[keys[i]].id+"/128/0)";
            thisapplink.setAttribute("class","draweritem drawerapp");
            thisapplink.innerHTML = appsObject[keys[i]].name;
            thisapplink.href = "#"+appsObject[keys[i]].id;
            drawer.appendChild(thisapplink);
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
                document.getElementById("bmdrawerframe").setAttribute("style","opacity:1;height:450px;");
                document.getElementById("bmarrow").setAttribute("style","opacity:1;");
                bmopened = 1;
                if (appsopened) {
                    document.getElementById("appsicon").click();
                    appsopened = 0;
                }
                setTimeout(function(){document.getElementById("bmsearch").focus()},200);
            } else if (bmopened) {
                document.getElementById("bmdrawerframe").setAttribute("style","opacity:0;height:0;");
                document.getElementById("bmarrow").setAttribute("style","opacity:0;");
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
});
window.onerror = function(){
    alert("Something went wrong. Please refresh the page and report this error to the developer");
}
console.log("%cNew New Tab Page (C) 2014 Zachary Guard","font-size:15px","\nContribute to the open source project at https://github.com/z-------------/New-New-Tab-Page");
