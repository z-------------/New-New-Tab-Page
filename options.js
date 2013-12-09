window.onload = function(){
    document.getElementById("slot1-i").value = localStorage.slot1i || "fb";
    document.getElementById("slot2-i").value = localStorage.slot2i || "ng";
    document.getElementById("slot3-i").value = localStorage.slot3i || "yt";
    document.getElementById("slot4-i").value = localStorage.slot4i || "rd";
    document.getElementById("slot5-i").value = localStorage.slot5i || "gp";
    document.getElementById("slot6-i").value = localStorage.slot6i || "gg";
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
        localStorage.slotcount = document.getElementById("slotcount").value;
        localStorage.bgopt = document.getElementById("bgopt").value;
        localStorage.usecustombg = document.getElementById("usecustombg").value;
        localStorage.custombg = document.getElementById("custombg").value;
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
        chrome.windows.create({url:"https://secure.jotform.me/form/33351374255452",width:350,type:"panel"});
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
}