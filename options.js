function getReleases(res) {
    var current = document.getElementById("vno").innerHTML,
        latest = res.data[0].name;
    checked = 1;
    console.log("Current: "+current+" Latest: "+latest);
    if (current != latest) {
        document.getElementById("check").value = "Update now";
        document.getElementById("check").onclick = function(){
            alert("An update for New New Tab Page is available:\n\n"+res.data[0].body+"\n\nGo to chrome://extensions and click \"Update extensions now\".\nYou may need to enable Developer Mode if you haven't yet done so.");
        }
        window.top.showUpdateMsg();
    } else if (current == latest) {
        document.getElementById("check").value = "No update available";
    }
}
function checkUpdates() {
    if (navigator.onLine == true) {
        var script = document.createElement("script");
        script.src = "https://api.github.com/repos/z-------------/New-New-Tab-Page/releases?callback=getReleases";
        document.getElementsByTagName("head")[0].appendChild(script);
        document.getElementById("check").value = "Checking...";
    } else {
        document.getElementById("check").value = "You're offline, styupid";
    }
}
function recalcSelectsStyle() {
    var scount = parseInt(document.getElementById("slotcount").value);
    for (var i=scount;i<12;i++){
        document.getElementsByTagName("select")[i].style.display = "none";
        document.getElementsByClassName("label")[i].style.display = "none";
    }
    for (var i=0;i<scount;i++){
        document.getElementsByTagName("select")[i].style.display = "inline-block";
        document.getElementsByClassName("label")[i].style.display = "inline-block";
    }
    document.getElementById("slotselects").style.height = 25*Math.ceil(scount/4)+8*Math.ceil(scount/4)+"px";
}
var map = {
    fb:"http://www.facebook.com",
    gp:"https://plus.google.com",
    yt:"http://www.youtube.com",
    ng:"http://9gag.com",
    gm:"https://mail.google.com",
    rd:"http://www.reddit.com",
    gg:"https://www.google.com",
    yh:"http://www.yahoo.com",
    gd:"https://drive.google.com",
    dg:"http://digg.com",
    vg:"http://www.theverge.com",
    tw:"https://twitter.com",
    pk:"http://getpocket.com/a/queue",
    gk:"https://drive.google.com/keep"
}
window.onload = function(){
    var checked = 0;
    document.getElementById("slot1-i").value = localStorage.slot1i || "fb";
    document.getElementById("slot2-i").value = localStorage.slot2i || "ng";
    document.getElementById("slot3-i").value = localStorage.slot3i || "yt";
    document.getElementById("slot4-i").value = localStorage.slot4i || "rd";
    document.getElementById("slot5-i").value = localStorage.slot5i || "gp";
    document.getElementById("slot6-i").value = localStorage.slot6i || "gg";
    document.getElementById("slot7-i").value = localStorage.slot7i || "yh";
    document.getElementById("slot8-i").value = localStorage.slot8i || "pk";
    document.getElementById("slot9-i").value = localStorage.slot9i || "tw";
    document.getElementById("slot10-i").value = localStorage.slot10i || "gd";
    document.getElementById("slot11-i").value = localStorage.slot11i || "gk";
    document.getElementById("slot12-i").value = localStorage.slot12i || "vg";
    document.getElementById("slotcount").value = localStorage.slotcount || "3";
    document.getElementById("bgopt").value = localStorage.bgopt || "bg";
    document.getElementById("usecustombg").checked = eval(localStorage.usecustombg) || false;
    document.getElementById("custombg").value = localStorage.custombg || "";
    document.getElementById("showWeather").checked = eval(localStorage.showWeather) || false;
    document.getElementById("weathercity").value = localStorage.weather_city || "";
    document.getElementById("showfb").checked = eval(localStorage.showFb) || false;
    document.getElementById("shownotif").checked = eval(localStorage.showNotif) || false;
    document.getElementById("showbookmarks").checked = eval(localStorage.showbookmarks) || false;
    document.getElementById("showstumble").checked = eval(localStorage.showStumble) || false;
    document.getElementById("topsitecount").value = localStorage.topsitecount || 6;
    document.getElementById("showallbookmarks").checked = eval(localStorage.showAllBookmarks) || false;
    document.getElementById("bgblur").checked = eval(localStorage.bgblur) || false
    document.getElementById("save").onclick = function(){
        localStorage.slot1i = document.getElementById("slot1-i").value;
        localStorage.slot2i = document.getElementById("slot2-i").value;
        localStorage.slot3i = document.getElementById("slot3-i").value;
        localStorage.slot4i = document.getElementById("slot4-i").value;
        localStorage.slot5i = document.getElementById("slot5-i").value;
        localStorage.slot6i = document.getElementById("slot6-i").value;
        localStorage.slot7i = document.getElementById("slot7-i").value;
        localStorage.slot8i = document.getElementById("slot8-i").value;
        localStorage.slot9i = document.getElementById("slot9-i").value;
        localStorage.slot10i = document.getElementById("slot10-i").value;
        localStorage.slot11i = document.getElementById("slot11-i").value;
        localStorage.slot12i = document.getElementById("slot12-i").value;
        localStorage.slotcount = document.getElementById("slotcount").value;
        localStorage.bgopt = document.getElementById("bgopt").value;
        localStorage.usecustombg = document.getElementById("usecustombg").checked;
        if (document.getElementById("custombg").value.indexOf("://") == -7) {
            localStorage.custombg = "http://" + document.getElementById("custombg").value;
        } else {
            localStorage.custombg = document.getElementById("custombg").value;
        }
        for (var i=1;i<=12;i++) {
            localStorage["slot"+i+"u"] = map[localStorage["slot"+i+"i"]];
        }
        localStorage.showWeather = document.getElementById("showWeather").checked;
        localStorage.weather_city = document.getElementById("weathercity").value;
        localStorage.showFb = document.getElementById("showfb").checked;
        localStorage.showNotif = document.getElementById("shownotif").checked;
        localStorage.showbookmarks = document.getElementById("showbookmarks").checked;
        localStorage.topsitecount = document.getElementById("topsitecount").value;
        localStorage.showStumble = document.getElementById("showstumble").checked;
        localStorage.showAllBookmarks = document.getElementById("showallbookmarks").checked;
        localStorage.bgblur = document.getElementById("bgblur").checked;
        console.log("Saved options");
        window.top.location.reload();
    }
    recalcSelectsStyle();
    document.getElementById("resetdefaults").onclick = function(){
        this.value = "Are you sure?";
        this.onclick = function(){
            localStorage.clear();
            localStorage.firstRun = "false";
            window.top.location.reload();
        }
    }
    document.getElementById("custiconslink").onclick = function(){
        window.parent.location = "customicons.html";
    }
    document.getElementById("check").onclick = checkUpdates;
    if (navigator.onLine == true) {
        setTimeout(checkUpdates,5000);
    }
    document.getElementById("slotcount").onchange = recalcSelectsStyle;
    setInterval(function(){
        for (var i=0;i<document.querySelectorAll("input[type=checkbox]").length;i++) {
            if (document.querySelectorAll("input[type=checkbox]")[i].checked == true) {
                document.querySelectorAll("input[type=checkbox]")[i].style.boxShadow = "inset 0 0 0 2px rgba(255,255,255,.5)";
                document.querySelectorAll("input[type=checkbox]")[i].style.backgroundColor = "rgba(255,255,255,.3)";
            } else {
                document.querySelectorAll("input[type=checkbox]")[i].style.boxShadow = "inset 0 0 0 2px rgba(255,255,255,.2)";
                document.querySelectorAll("input[type=checkbox]")[i].style.backgroundColor = "transparent";
            }
        }
    },100);
}