function getReleases(res) {
    var current = document.getElementById("vno").innerHTML,
        latest = res.data[0].name;
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
    var script = document.createElement("script");
    script.src = "https://api.github.com/repos/z-------------/New-New-Tab-Page/releases?callback=getReleases";
    document.getElementsByTagName("head")[0].appendChild(script);
}
window.onload = function(){
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
    document.getElementById("usecustombg").value = localStorage.usecustombg || "false";
    document.getElementById("custombg").value = localStorage.custombg || "";
    document.getElementById("bgblur").value = localStorage.bgblur || "false";
    document.getElementById("showWeather").value = localStorage.showWeather || "false";
    document.getElementById("weathercity").value = localStorage.weather_city || "";
    document.getElementById("showfb").value = localStorage.showFb || "false";
    document.getElementById("shownotif").value = localStorage.showNotif || "false";
    document.getElementById("showbookmarks").value = localStorage.showbookmarks || "false";
    document.getElementById("showstumble").value = localStorage.showStumble || "false";
    document.getElementById("topsitecount").value = localStorage.topsitecount || 6;
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
        localStorage.usecustombg = document.getElementById("usecustombg").value;
        if (document.getElementById("custombg").value.indexOf("://") == -7) {
            localStorage.custombg = "http://" + document.getElementById("custombg").value;
        } else {
            localStorage.custombg = document.getElementById("custombg").value;
        }
        localStorage.bgblur = document.getElementById("bgblur").value;
        //set urls
        //someday find a way to do this with a function instead of typing out every possibility
        if (localStorage.slot1i == "fb") {
            localStorage.slot1u = "http://www.facebook.com";
        } else if (localStorage.slot1i == "gp") {
            localStorage.slot1u = "https://plus.google.com";
        } else if (localStorage.slot1i == "yt") {
            localStorage.slot1u = "http://www.youtube.com";
        } else if (localStorage.slot1i == "ng") {
            localStorage.slot1u = "http://9gag.com";
        } else if (localStorage.slot1i == "gm") {
            localStorage.slot1u = "https://mail.google.com";
        } else if (localStorage.slot1i == "rd") {
            localStorage.slot1u = "http://www.reddit.com";
        } else if (localStorage.slot1i == "gg") {
            localStorage.slot1u = "https://www.google.com";
        } else if (localStorage.slot1i == "yh") {
            localStorage.slot1u = "http://www.yahoo.com";
        } else if (localStorage.slot1i == "gd") {
            localStorage.slot1u = "https://drive.google.com";
        } else if (localStorage.slot1i == "dg") {
            localStorage.slot1u = "http://digg.com";
        } else if (localStorage.slot1i == "vg") {
            localStorage.slot1u = "http://www.theverge.com"
        } else if (localStorage.slot1i == "tw") {
            localStorage.slot1u = "https://twitter.com"
        } else if (localStorage.slot1i == "pk") {
            localStorage.slot1u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot1i == "gk") {
            localStorage.slot1u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot2i == "fb") {
            localStorage.slot2u = "http://www.facebook.com";
        } else if (localStorage.slot2i == "gp") {
            localStorage.slot2u = "https://plus.google.com";
        } else if (localStorage.slot2i == "yt") {
            localStorage.slot2u = "http://www.youtube.com";
        } else if (localStorage.slot2i == "ng") {
            localStorage.slot2u = "http://9gag.com";
        } else if (localStorage.slot2i == "gm") {
            localStorage.slot2u = "https://mail.google.com";
        } else if (localStorage.slot2i == "rd") {
            localStorage.slot2u = "http://www.reddit.com";
        } else if (localStorage.slot2i == "gg") {
            localStorage.slot2u = "https://www.google.com";
        } else if (localStorage.slot2i == "yh") {
            localStorage.slot2u = "http://www.yahoo.com";
        } else if (localStorage.slot2i == "gd") {
            localStorage.slot2u = "https://drive.google.com";
        } else if (localStorage.slot2i == "dg") {
            localStorage.slot2u = "http://digg.com";
        } else if (localStorage.slot2i == "vg") {
            localStorage.slot2u = "http://www.theverge.com"
        } else if (localStorage.slot2i == "tw") {
            localStorage.slot2u = "https://twitter.com"
        } else if (localStorage.slot2i == "pk") {
            localStorage.slot2u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot2i == "gk") {
            localStorage.slot2u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot3i == "fb") {
            localStorage.slot3u = "http://www.facebook.com";
        } else if (localStorage.slot3i == "gp") {
            localStorage.slot3u = "https://plus.google.com";
        } else if (localStorage.slot3i == "yt") {
            localStorage.slot3u = "http://www.youtube.com";
        } else if (localStorage.slot3i == "ng") {
            localStorage.slot3u = "http://9gag.com";
        } else if (localStorage.slot3i == "gm") {
            localStorage.slot3u = "https://mail.google.com";
        } else if (localStorage.slot3i == "rd") {
            localStorage.slot3u = "http://www.reddit.com";
        } else if (localStorage.slot3i == "gg") {
            localStorage.slot3u = "https://www.google.com";
        } else if (localStorage.slot3i == "yh") {
            localStorage.slot3u = "http://www.yahoo.com";
        } else if (localStorage.slot3i == "gd") {
            localStorage.slot3u = "https://drive.google.com";
        } else if (localStorage.slot3i == "dg") {
            localStorage.slot3u = "http://digg.com";
        } else if (localStorage.slot3i == "vg") {
            localStorage.slot3u = "http://www.theverge.com"
        } else if (localStorage.slot3i == "tw") {
            localStorage.slot3u = "https://twitter.com"
        } else if (localStorage.slot3i == "pk") {
            localStorage.slot3u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot3i == "gk") {
            localStorage.slot3u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot4i == "fb") {
            localStorage.slot4u = "http://www.facebook.com";
        } else if (localStorage.slot4i == "gp") {
            localStorage.slot4u = "https://plus.google.com";
        } else if (localStorage.slot4i == "yt") {
            localStorage.slot4u = "http://www.youtube.com";
        } else if (localStorage.slot4i == "ng") {
            localStorage.slot4u = "http://9gag.com";
        } else if (localStorage.slot4i == "gm") {
            localStorage.slot4u = "https://mail.google.com";
        } else if (localStorage.slot4i == "rd") {
            localStorage.slot4u = "http://www.reddit.com";
        } else if (localStorage.slot4i == "gg") {
            localStorage.slot4u = "https://www.google.com";
        } else if (localStorage.slot4i == "yh") {
            localStorage.slot4u = "http://www.yahoo.com";
        } else if (localStorage.slot4i == "gd") {
            localStorage.slot4u = "https://drive.google.com";
        } else if (localStorage.slot4i == "dg") {
            localStorage.slot4u = "http://digg.com";
        } else if (localStorage.slot4i == "vg") {
            localStorage.slot4u = "http://www.theverge.com"
        } else if (localStorage.slot4i == "tw") {
            localStorage.slot4u = "https://twitter.com"
        } else if (localStorage.slot4i == "pk") {
            localStorage.slot4u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot4i == "gk") {
            localStorage.slot4u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot5i == "fb") {
            localStorage.slot5u = "http://www.facebook.com";
        } else if (localStorage.slot5i == "gp") {
            localStorage.slot5u = "https://plus.google.com";
        } else if (localStorage.slot5i == "yt") {
            localStorage.slot5u = "http://www.youtube.com";
        } else if (localStorage.slot5i == "ng") {
            localStorage.slot5u = "http://9gag.com";
        } else if (localStorage.slot5i == "gm") {
            localStorage.slot5u = "https://mail.google.com";
        } else if (localStorage.slot5i == "rd") {
            localStorage.slot5u = "http://www.reddit.com";
        } else if (localStorage.slot5i == "gg") {
            localStorage.slot5u = "https://www.google.com";
        } else if (localStorage.slot5i == "yh") {
            localStorage.slot5u = "http://www.yahoo.com";
        } else if (localStorage.slot5i == "gd") {
            localStorage.slot5u = "https://drive.google.com";
        } else if (localStorage.slot5i == "dg") {
            localStorage.slot5u = "http://digg.com";
        } else if (localStorage.slot5i == "vg") {
            localStorage.slot5u = "http://www.theverge.com"
        } else if (localStorage.slot5i == "tw") {
            localStorage.slot5u = "https://twitter.com"
        } else if (localStorage.slot5i == "pk") {
            localStorage.slot5u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot5i == "gk") {
            localStorage.slot5u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot6i == "fb") {
            localStorage.slot6u = "http://www.facebook.com";
        } else if (localStorage.slot6i == "gp") {
            localStorage.slot6u = "https://plus.google.com";
        } else if (localStorage.slot6i == "yt") {
            localStorage.slot6u = "http://www.youtube.com";
        } else if (localStorage.slot6i == "ng") {
            localStorage.slot6u = "http://9gag.com";
        } else if (localStorage.slot6i == "gm") {
            localStorage.slot6u = "https://mail.google.com";
        } else if (localStorage.slot6i == "rd") {
            localStorage.slot6u = "http://www.reddit.com";
        } else if (localStorage.slot6i == "gg") {
            localStorage.slot6u = "https://www.google.com";
        } else if (localStorage.slot6i == "yh") {
            localStorage.slot6u = "http://www.yahoo.com";
        } else if (localStorage.slot6i == "gd") {
            localStorage.slot6u = "https://drive.google.com";
        } else if (localStorage.slot6i == "dg") {
            localStorage.slot6u = "http://digg.com";
        } else if (localStorage.slot6i == "vg") {
            localStorage.slot6u = "http://www.theverge.com"
        } else if (localStorage.slot6i == "tw") {
            localStorage.slot6u = "https://twitter.com"
        } else if (localStorage.slot6i == "pk") {
            localStorage.slot6u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot6i == "gk") {
            localStorage.slot6u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot7i == "fb") {
            localStorage.slot7u = "http://www.facebook.com";
        } else if (localStorage.slot7i == "gp") {
            localStorage.slot7u = "https://plus.google.com";
        } else if (localStorage.slot7i == "yt") {
            localStorage.slot7u = "http://www.youtube.com";
        } else if (localStorage.slot7i == "ng") {
            localStorage.slot7u = "http://9gag.com";
        } else if (localStorage.slot7i == "gm") {
            localStorage.slot7u = "https://mail.google.com";
        } else if (localStorage.slot7i == "rd") {
            localStorage.slot7u = "http://www.reddit.com";
        } else if (localStorage.slot7i == "gg") {
            localStorage.slot7u = "https://www.google.com";
        } else if (localStorage.slot7i == "yh") {
            localStorage.slot7u = "http://www.yahoo.com";
        } else if (localStorage.slot7i == "gd") {
            localStorage.slot7u = "https://drive.google.com";
        } else if (localStorage.slot7i == "dg") {
            localStorage.slot7u = "http://digg.com";
        } else if (localStorage.slot7i == "vg") {
            localStorage.slot7u = "http://www.theverge.com"
        } else if (localStorage.slot7i == "tw") {
            localStorage.slot7u = "https://twitter.com"
        } else if (localStorage.slot7i == "pk") {
            localStorage.slot7u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot7i == "gk") {
            localStorage.slot7u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot8i == "fb") {
            localStorage.slot8u = "http://www.facebook.com";
        } else if (localStorage.slot8i == "gp") {
            localStorage.slot8u = "https://plus.google.com";
        } else if (localStorage.slot8i == "yt") {
            localStorage.slot8u = "http://www.youtube.com";
        } else if (localStorage.slot8i == "ng") {
            localStorage.slot8u = "http://9gag.com";
        } else if (localStorage.slot8i == "gm") {
            localStorage.slot8u = "https://mail.google.com";
        } else if (localStorage.slot8i == "rd") {
            localStorage.slot8u = "http://www.reddit.com";
        } else if (localStorage.slot8i == "gg") {
            localStorage.slot8u = "https://www.google.com";
        } else if (localStorage.slot8i == "yh") {
            localStorage.slot8u = "http://www.yahoo.com";
        } else if (localStorage.slot8i == "gd") {
            localStorage.slot8u = "https://drive.google.com";
        } else if (localStorage.slot8i == "dg") {
            localStorage.slot8u = "http://digg.com";
        } else if (localStorage.slot8i == "vg") {
            localStorage.slot8u = "http://www.theverge.com"
        } else if (localStorage.slot8i == "tw") {
            localStorage.slot8u = "https://twitter.com"
        } else if (localStorage.slot8i == "pk") {
            localStorage.slot8u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot8i == "gk") {
            localStorage.slot8u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot9i == "fb") {
            localStorage.slot9u = "http://www.facebook.com";
        } else if (localStorage.slot9i == "gp") {
            localStorage.slot9u = "https://plus.google.com";
        } else if (localStorage.slot9i == "yt") {
            localStorage.slot9u = "http://www.youtube.com";
        } else if (localStorage.slot9i == "ng") {
            localStorage.slot9u = "http://9gag.com";
        } else if (localStorage.slot9i == "gm") {
            localStorage.slot9u = "https://mail.google.com";
        } else if (localStorage.slot9i == "rd") {
            localStorage.slot9u = "http://www.reddit.com";
        } else if (localStorage.slot9i == "gg") {
            localStorage.slot9u = "https://www.google.com";
        } else if (localStorage.slot9i == "yh") {
            localStorage.slot9u = "http://www.yahoo.com";
        } else if (localStorage.slot9i == "gd") {
            localStorage.slot9u = "https://drive.google.com";
        } else if (localStorage.slot9i == "dg") {
            localStorage.slot9u = "http://digg.com";
        } else if (localStorage.slot9i == "vg") {
            localStorage.slot9u = "http://www.theverge.com"
        } else if (localStorage.slot9i == "tw") {
            localStorage.slot9u = "https://twitter.com"
        } else if (localStorage.slot9i == "pk") {
            localStorage.slot9u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot9i == "gk") {
            localStorage.slot9u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot10i == "fb") {
            localStorage.slot10u = "http://www.facebook.com";
        } else if (localStorage.slot10i == "gp") {
            localStorage.slot10u = "https://plus.google.com";
        } else if (localStorage.slot10i == "yt") {
            localStorage.slot10u = "http://www.youtube.com";
        } else if (localStorage.slot10i == "ng") {
            localStorage.slot10u = "http://9gag.com";
        } else if (localStorage.slot10i == "gm") {
            localStorage.slot10u = "https://mail.google.com";
        } else if (localStorage.slot10i == "rd") {
            localStorage.slot10u = "http://www.reddit.com";
        } else if (localStorage.slot10i == "gg") {
            localStorage.slot10u = "https://www.google.com";
        } else if (localStorage.slot10i == "yh") {
            localStorage.slot10u = "http://www.yahoo.com";
        } else if (localStorage.slot10i == "gd") {
            localStorage.slot10u = "https://drive.google.com";
        } else if (localStorage.slot10i == "dg") {
            localStorage.slot10u = "http://digg.com";
        } else if (localStorage.slot10i == "vg") {
            localStorage.slot10u = "http://www.theverge.com"
        } else if (localStorage.slot10i == "tw") {
            localStorage.slot10u = "https://twitter.com"
        } else if (localStorage.slot10i == "pk") {
            localStorage.slot10u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot10i == "gk") {
            localStorage.slot10u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot11i == "fb") {
            localStorage.slot11u = "http://www.facebook.com";
        } else if (localStorage.slot11i == "gp") {
            localStorage.slot11u = "https://plus.google.com";
        } else if (localStorage.slot11i == "yt") {
            localStorage.slot11u = "http://www.youtube.com";
        } else if (localStorage.slot11i == "ng") {
            localStorage.slot11u = "http://9gag.com";
        } else if (localStorage.slot11i == "gm") {
            localStorage.slot11u = "https://mail.google.com";
        } else if (localStorage.slot11i == "rd") {
            localStorage.slot11u = "http://www.reddit.com";
        } else if (localStorage.slot11i == "gg") {
            localStorage.slot11u = "https://www.google.com";
        } else if (localStorage.slot11i == "yh") {
            localStorage.slot11u = "http://www.yahoo.com";
        } else if (localStorage.slot11i == "gd") {
            localStorage.slot11u = "https://drive.google.com";
        } else if (localStorage.slot11i == "dg") {
            localStorage.slot11u = "http://digg.com";
        } else if (localStorage.slot11i == "vg") {
            localStorage.slot11u = "http://www.theverge.com"
        } else if (localStorage.slot11i == "tw") {
            localStorage.slot11u = "https://twitter.com"
        } else if (localStorage.slot11i == "pk") {
            localStorage.slot11u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot11i == "gk") {
            localStorage.slot11u = "https://drive.google.com/keep/"
        }
        if (localStorage.slot12i == "fb") {
            localStorage.slot12u = "http://www.facebook.com";
        } else if (localStorage.slot12i == "gp") {
            localStorage.slot12u = "https://plus.google.com";
        } else if (localStorage.slot12i == "yt") {
            localStorage.slot12u = "http://www.youtube.com";
        } else if (localStorage.slot12i == "ng") {
            localStorage.slot12u = "http://9gag.com";
        } else if (localStorage.slot12i == "gm") {
            localStorage.slot12u = "https://mail.google.com";
        } else if (localStorage.slot12i == "rd") {
            localStorage.slot12u = "http://www.reddit.com";
        } else if (localStorage.slot12i == "gg") {
            localStorage.slot12u = "https://www.google.com";
        } else if (localStorage.slot12i == "yh") {
            localStorage.slot12u = "http://www.yahoo.com";
        } else if (localStorage.slot12i == "gd") {
            localStorage.slot12u = "https://drive.google.com";
        } else if (localStorage.slot12i == "dg") {
            localStorage.slot12u = "http://digg.com";
        } else if (localStorage.slot12i == "vg") {
            localStorage.slot12u = "http://www.theverge.com"
        } else if (localStorage.slot12i == "tw") {
            localStorage.slot12u = "https://twitter.com"
        } else if (localStorage.slot12i == "pk") {
            localStorage.slot12u = "http://getpocket.com/a/queue/"
        } else if (localStorage.slot12i == "gk") {
            localStorage.slot12u = "https://drive.google.com/keep/"
        }
        localStorage.showWeather = document.getElementById("showWeather").value;
        localStorage.weather_city = document.getElementById("weathercity").value;
        localStorage.showFb = document.getElementById("showfb").value;
        localStorage.showNotif = document.getElementById("shownotif").value;
        localStorage.showbookmarks = document.getElementById("showbookmarks").value;
        localStorage.topsitecount = document.getElementById("topsitecount").value;
        localStorage.showStumble = document.getElementById("showstumble").value;
        console.log("Saved options");
        var refrashBool = confirm("Options saved. Click OK to refresh or Cancel to stay on this page");
        if (refrashBool) {
            window.parent.location.reload();
        }
    }
    document.getElementById("reqfea").onclick = function(){
        chrome.windows.create({url:"https://secure.jotform.me/form/3335737102551052",width:350,type:"panel"});
    }
    document.getElementById("resetdefaults").onclick = function(){
        var confirmreset = confirm("Are you sure you want to reset all options to defaults?");
        if (confirmreset) {
            localStorage.clear();
            window.parent.location.reload();
        }
    }
    document.getElementById("custiconslink").onclick = function(){
        window.parent.location = "customicons.html";
    }
    setTimeout(function(){
        document.getElementById("forkcont").innerHTML = document.getElementById("forkcont").innerHTML + "<img src=https://s3.amazonaws.com/github/ribbons/forkme_left_gray_6d6d6d.png alt=\"Fork me on GitHub\" id=forkme>";
        document.getElementById("forkme").onclick = function(){
            window.top.location = "https://github.com/z-------------/New-New-Tab-Page";
        }
    },1000);
    document.getElementById("credlink").onclick = function(){
        window.parent.location = "http://zacharyguard.co.nf";
    }
    document.getElementById("check").onclick = checkUpdates;
    setTimeout(checkUpdates,5000);
}