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
        console.log(weather);
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
            console.log("Not sure which weather icon to use so defaulting to clear.png");
            icon = "sunny";
        }
        document.getElementById("weatherprvw").style.backgroundImage = "url(img/weather/"+icon+".png)";
        document.getElementById("weatherprvw").setAttribute("style",document.getElementById("weatherprvw").getAttribute("style")+"opacity:1;");
    }
}
var slot1i = localStorage.slot1i || "fb",
    slot1u = localStorage.slot1u || "http://www.facebook.com",
    slot2i = localStorage.slot2i || "ng",
    slot2u = localStorage.slot2u || "http://9gag.com",
    slot3i = localStorage.slot3i || "yt",
    slot3u = localStorage.slot3u || "http://www.youtube.com",
    slot4i = localStorage.slot4i || "rd",
    slot4u = localStorage.slot4u || "http://www.reddit.com",
    slot5i = localStorage.slot5i || "gp",
    slot5u = localStorage.slot5u || "https://plus.google.com",
    slot6i = localStorage.slot6i || "gg",
    slot6u = localStorage.slot6u || "https://www.google.com",
    slot7i = localStorage.slot7i || "yh",
    slot7u = localStorage.slot7u || "http://www.yahoo.com",
    slot8i = localStorage.slot8i || "pk",
    slot8u = localStorage.slot8u || "http://getpocket.com/a/queue/",
    slot9i = localStorage.slot9i || "tw",
    slot9u = localStorage.slot9u || "https://twitter.com",
    slot10i = localStorage.slot10i || "gd",
    slot10u = localStorage.slot10u || "https://drive.google.com";
    slot11i = localStorage.slot11i || "gk",
    slot11u = localStorage.slot11u || "https://drive.google.com/keep";
    slot12i = localStorage.slot12i || "vg",
    slot12u = localStorage.slot12u || "http://www.theverge.com";
    slotcount = localStorage.slotcount || "3";
    bgopt = localStorage.bgopt || "bg";
    showAppsDrawer = localStorage.showappdrawer || "true";
    if (localStorage.topsitecount == null) {
        var topsitecount = 6;
    } else if (localStorage.topsitecount == "0"){
        var topsitecount = 0;
    } else {
        var topsitecount = parseInt(localStorage.topsitecount);
    }
    showBookmarks = localStorage.showbookmarks || "true";
window.onload = function(){
    if (localStorage.usecustombg !== "true") {
        document.getElementById("bg").style.backgroundImage = "url(img/"+bgopt+".png)";
    } else {
        document.getElementById("bg").style.backgroundImage = "url("+localStorage.custombg+")";
    }
    if (slotcount == 3) {
        document.getElementById("container").style.width = "450px";
        document.getElementById("container").style.marginLeft = "-225px";
    } else if (slotcount == 4) {
        document.getElementById("container").style.width = "600px";
        document.getElementById("container").style.marginLeft = "-300px";
    } else if (slotcount == 5) {
        document.getElementById("container").style.width = "750px";
        document.getElementById("container").style.marginLeft = "-375px";
    } else if (slotcount == 6) {
        document.getElementById("container").style.width = "900px";
        document.getElementById("container").style.marginLeft = "-450px";
    } else if (slotcount == 7) {
        document.getElementById("container").style.width = "600px";
        document.getElementById("container").style.height = "300px";
        document.getElementById("container").style.marginLeft = "-300px";
        document.getElementById("container").style.marginTop = "-150px";
    } else if (slotcount == 8) {
        document.getElementById("container").style.width = "600px";
        document.getElementById("container").style.height = "300px";
        document.getElementById("container").style.marginLeft = "-300px";
        document.getElementById("container").style.marginTop = "-150px";
    } else if (slotcount == 9) {
        document.getElementById("container").style.width = "750px";
        document.getElementById("container").style.height = "300px";
        document.getElementById("container").style.marginLeft = "-375px";
        document.getElementById("container").style.marginTop = "-150px";
    } else if (slotcount == 10) {
        document.getElementById("container").style.width = "750px";
        document.getElementById("container").style.height = "300px";
        document.getElementById("container").style.marginLeft = "-375px";
        document.getElementById("container").style.marginTop = "-150px";
    } else if (slotcount == 11) {
        document.getElementById("container").style.width = "900px";
        document.getElementById("container").style.height = "300px";
        document.getElementById("container").style.marginLeft = "-450px";
        document.getElementById("container").style.marginTop = "-150px";
    } else if (slotcount == 12) {
        document.getElementById("container").style.width = "900px";
        document.getElementById("container").style.height = "300px";
        document.getElementById("container").style.marginLeft = "-450px";
        document.getElementById("container").style.marginTop = "-150px";
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
    if (slotcount >= 1) {
        if (localStorage.slot1usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot1i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot1i).onclick = function(){
                    window.location = slot1u;
                    white();
                }
            },200);
        } else if (localStorage.slot1usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot1ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[0].onclick = function(){
                    window.location = localStorage.slot1uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 2) {
        if (localStorage.slot2usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot2i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot2i).onclick = function(){
                    window.location = slot2u;
                    white();
                }
            },200);
        } else if (localStorage.slot2usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot2ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[1].onclick = function(){
                    window.location = localStorage.slot2uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 3) {
        if (localStorage.slot3usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot3i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot3i).onclick = function(){
                    window.location = slot3u;
                    white();
                }
            },200);
        } else if (localStorage.slot3usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot3ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[2].onclick = function(){
                    window.location = localStorage.slot3uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 4) {
        if (localStorage.slot4usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot4i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot4i).onclick = function(){
                    window.location = slot4u;
                    white();
                }
            },200);
        } else if (localStorage.slot4usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot4ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[3].onclick = function(){
                    window.location = localStorage.slot4uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 5) {
        if (localStorage.slot5usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot5i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot5i).onclick = function(){
                    window.location = slot5u;
                    white();
                }
            },200);
        } else if (localStorage.slot5usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot5ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[4].onclick = function(){
                    window.location = localStorage.slot5uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 6) {
        if (localStorage.slot6usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot6i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot6i).onclick = function(){
                    window.location = slot6u;
                    white();
                }
            },200);
        } else if (localStorage.slot6usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot6ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[5].onclick = function(){
                    window.location = localStorage.slot6uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 7) {
        if (localStorage.slot7usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot7i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot7i).onclick = function(){
                    window.location = slot7u;
                    white();
                }
            },200);
        } else if (localStorage.slot7usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot7ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[6].onclick = function(){
                    window.location = localStorage.slot7uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 8) {
        if (localStorage.slot8usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot8i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot8i).onclick = function(){
                    window.location = slot8u;
                    white();
                }
            },200);
        } else if (localStorage.slot8usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot8ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[7].onclick = function(){
                    window.location = localStorage.slot8uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 9) {
        if (localStorage.slot9usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot9i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot9i).onclick = function(){
                    window.location = slot9u;
                    white();
                }
            },200);
        } else if (localStorage.slot9usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot9ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[8].onclick = function(){
                    window.location = localStorage.slot9uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 10) {
        if (localStorage.slot10usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot10i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot10i).onclick = function(){
                    window.location = slot10u;
                    white();
                }
            },200);
        } else if (localStorage.slot10usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot10ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[9].onclick = function(){
                    window.location = localStorage.slot10uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 11) {
        if (localStorage.slot11usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot11i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot11i).onclick = function(){
                    window.location = slot11u;
                    white();
                }
            },200);
        } else if (localStorage.slot11usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot11ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[10].onclick = function(){
                    window.location = localStorage.slot11uc;
                    white();
                }
            },200);
        }
    }
    if (slotcount >= 12) {
        if (localStorage.slot12usec != "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div id="+slot12i+" class=app></div>";
            setTimeout(function(){
                document.getElementById(slot12i).onclick = function(){
                    window.location = slot12u;
                    white();
                }
            },200);
        } else if (localStorage.slot12usec == "true") {
            document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + "<div class=\"app cust\" style=background-image:url("+localStorage.slot12ic+");></div>";
            setTimeout(function(){
                document.getElementsByClassName("app")[11].onclick = function(){
                    window.location = localStorage.slot12uc;
                    white();
                }
            },200);
        }
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
            for (var i=0;i<document.querySelectorAll(".app").length;i++) {
                document.querySelectorAll(".app")[i].style.opacity = "0";
            }
            optsopened = 1;
        } else {
            document.getElementById("options").style.opacity = "0";
            document.getElementById("options").style.top = "150%";
            for (var i=0;i<document.querySelectorAll(".app").length;i++) {
                document.querySelectorAll(".app")[i].style.opacity = "1";
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
                    var appid = window.location.hash.substring(1,window.location.hash.length);
                    chrome.management.launchApp(appid);
                    window.location.hash = "";
                }
            },1)
        }
        for (i=0;i<keys.length;i++) {
            var drawer = document.querySelector("#applist"),
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
                if (res[i].url.indexOf("javascript:") == -1) {
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
        document.querySelector("#bmsearch").onwebkitspeechchange = function(){
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
    setInterval(function(){window.scrollTo(0,0)},500);
}
window.onerror = function(){
    alert("Something went wrong. Refresh the page and if that doesn't work, reset to default settings");
}
function showUpdateMsg() {
    document.getElementById("updatemsg").setAttribute("style","opacity:1");
    document.getElementById("updatearrow").setAttribute("style","opacity:1");
}
console.log("New New Tab Page (C) 2013 Zachary Guard");