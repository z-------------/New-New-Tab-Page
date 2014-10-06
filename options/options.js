function round(n, unit) {
    if (unit === null || typeof unit === "undefined") {
        unit = 1;
    }
    return Math.round(n/unit) * unit;
}

if (location.hash === "#iframe") {
    document.body.style.backgroundColor = "transparent";
}

var settings = {};

var defaultSettings = {
    slotCount: 3,
    showAppsDrawer: true,
    topSiteCount: 6,
    showBookmarks: false,
    showAllBookmarks: false,
    firstRun: false,
    backgroundURL: "url(/img/bg.jpg)",
    bgBlur: false,
    titleText: "New Tab",
    showWeather: false,
    showFB: false,
    showFBNotif: false,
    showStumble: false,
    autoClose: true,
    showNews: false,
    showTumblr: false,
    apps: [],
    noAnimation: false,
    useFahrenheit: false
};

var bgPreview = document.getElementById("bgpreview");
var bgPresetsSelect = document.getElementById("bgopt");
var bgURL = document.getElementById("custombg");
var bgLocal = document.getElementById("bglocal");

document.getElementById("resetdefaults").onclick = function () {
    this.textContent = "Click again to confirm";
    this.onclick = function () {
        chrome.storage.sync.clear(function () {
            chrome.storage.local.clear();
            chrome.storage.sync.set({
                firstRun: false
            }, function () {
                window.top.location.reload();
            });
        });
    };
};

// version label next to title
document.querySelector("#vno").innerHTML = "v" + chrome.app.getDetails().version;

// background preview
bgPresetsSelect.oninput = bgPresetsSelect.onchange = function () {
    if (this.value !== this.children[0].textContent) {
        bgPreview.style.backgroundImage = "url(/img/" + this.value + ".png)";
    }
};

bgURL.onchange = function () {
    if (this.value.indexOf(":") <= 5) { // has protocol
        bgPreview.style.backgroundImage = "url(" + this.value + ")";
    } else { // doesn't have a protocol, add one
        bgPreview.style.backgroundImage = "url(http://" + this.value + ")";
    }
};

bgLocal.onchange = function () {
    var file = this.files[0];
    if (file.size < 4294967296) { // 4gb
        var reader = new FileReader();
        reader.onloadend = function (e) {
            if (e.target.readyState === reader.DONE) {
                var dataURL = e.target.result;
                bgPreview.style.backgroundImage = "url(" + dataURL + ")";
            }
        };
        reader.readAsDataURL(file);
    } else {
        this.value = null;
        alert("The image is chose is too big. Please choose a file less than 4gb in size.");
    }
};

Array.prototype.valueIs = function (key, value) {
    for (i = 0; i < this.length; i++) {
        if (this[i][key] === value) {
            return this[i];
            break;
        }
    }
};

Array.prototype.alphaSort = function (key) {
    var array = this;
    array.sort(function (a, b) {
        if (a[key].toLowerCase() < b[key].toLowerCase()) return -1;
        if (a[key].toLowerCase() > b[key].toLowerCase()) return 1;
        return 0;
    });
    return array;
};

var appPresets = [{
    name: "Facebook",
    url: "https://www.facebook.com",
    icon: "/img/fb.png"
}, {
    name: "Google+",
    url: "https://plus.google.com",
    icon: "/img/gp.png"
}, {
    name: "YouTube",
    url: "http://www.youtube.com",
    icon: "/img/yt.png"
}, {
    name: "9gag",
    url: "http://9gag.com",
    icon: "/img/ng.png"
}, {
    name: "Gmail",
    url: "https://mail.google.com",
    icon: "/img/gm.png"
}, {
    name: "Reddit",
    url: "http://www.reddit.com",
    icon: "/img/rd.png"
}, {
    name: "Google",
    url: "https://www.google.com",
    icon: "/img/gg.png"
}, {
    name: "Yahoo",
    url: "http://www.yahoo.com",
    icon: "/img/yh.png"
}, {
    name: "Google Drive",
    url: "https://drive.google.com",
    icon: "/img/gd.png"
}, {
    name: "Digg",
    url: "http://www.digg.com",
    icon: "/img/dg.png"
}, {
    name: "The Verge",
    url: "http://www.theverge.com",
    icon: "/img/vg.png"
}, {
    name: "Twitter",
    url: "https://www.twitter.com",
    icon: "/img/tw.png"
}, {
    name: "Pocket",
    url: "http://getpocket.com/a/queue",
    icon: "/img/pk.png"
}, {
    name: "Google Keep",
    url: "https://drive.google.com/keep",
    icon: "/img/gk.png"
}].alphaSort("name");

defaultSettings.apps = [{
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

function readOption(key, callback) {
    // console.log("read option '%s'", key);
    var val = defaultSettings[key];
    if (settings[key] !== undefined) {
        val = settings[key];
    }
    callback(val);
}

chrome.storage.sync.get(null, function (sr) {
    settings = sr;
    chrome.storage.local.get("backgroundURL", function (lr) {
        if (lr.backgroundURL !== undefined) {
            settings.backgroundURL = lr.backgroundURL;
        }

        var apps = [];

        /* main stuff */
        readOption("slotCount", function (val) {
            document.getElementById("slotcount").value = val;
        });

        readOption("apps", function (val) {
            apps = val;
        });

        var appLiTemplate = "\
<input type='url' class='url' placeholder='URL'>\
<input type='text' class='icon' placeholder='Icon URL'>\
<select class='presets'>\
<option>App presets</option>\
</select>\
";

        var appOpts = document.getElementById("appopts");
        var appOptsList = appOpts.querySelector("ol");

        function iconPreview(input) {
            input.parentElement.style.backgroundImage = "url(" + input.value + ")";
        }

        for (i = 0; i < 12; i++) {
            var appLi = document.createElement("li");
            appLi.innerHTML = appLiTemplate;

            var presetsSelect = appLi.querySelector(".presets");
            for (j = 0; j < appPresets.length; j++) {
                presetsSelect.innerHTML += "<option>" + appPresets[j].name + "</option>";
            }

            presetsSelect.oninput = function () {
                var urlInput = this.parentElement.querySelector(".url");
                var iconInput = this.parentElement.querySelector(".icon");

                if (this.value !== presetsSelect.childNodes[0].textContent) {
                    urlInput.value = appPresets.valueIs("name", this.value).url;
                    iconInput.value = appPresets.valueIs("name", this.value).icon;
                    iconPreview(iconInput);
                }
            };

            var urlInput = appLi.querySelector(".url");
            var iconInput = appLi.querySelector(".icon");

            urlInput.value = apps[i].url;
            iconInput.value = apps[i].icon;
            iconPreview(iconInput);

            iconInput.oninput = function () {
                iconPreview(this);
            };

            if (i >= Number(slotcount.value)) {
                appLi.classList.add("hidden");
            }
            appLi.dataset.slotno = i + 1;

            appOptsList.appendChild(appLi);
        }

        slotcount.oninput = function () {
            var appLis = appOptsList.querySelectorAll("li");
            var count = Number(this.value) || 0;

            if (count < 0) count = 0;
            if (count > 12) count = 12;

            for (i = 0; i < appLis.length; i++) {
                if (i < count) {
                    appLis[i].classList.remove("hidden");
                } else {
                    appLis[i].classList.add("hidden");
                }
            }
        };

        slotcount.onchange = function () {
            if (Number(this.value) < 0) {
                this.value = "0";
            }
            if (Number(this.value) > 12) {
                this.value = "12";
            }

            this.oninput();
        };

        readOption("showWeather", function (val) {
            document.getElementById("showWeather").checked = val;
        });
        readOption("showFB", function (val) {
            document.getElementById("showfb").checked = val;
        });
        readOption("showFBNotif", function (val) {
            document.getElementById("shownotif").checked = val;
        });
        readOption("showBookmarks", function (val) {
            document.getElementById("showbookmarks").checked = val;
        });
        readOption("showStumble", function (val) {
            document.getElementById("showstumble").checked = val;
        });
        readOption("topSiteCount", function (val) {
            document.getElementById("topsitecount").value = val;
        });
        readOption("showAllBookmarks", function (val) {
            document.getElementById("showallbookmarks").checked = val;
        });
        readOption("bgBlur", function (val) {
            document.getElementById("bgblur").checked = val;
        });
        readOption("useFahrenheit", function (val) {
            document.getElementById("usefahrenheit").checked = val;
        });
        readOption("noAnimation", function (val) {
            document.getElementById("disableanimation").checked = val;
        });
        readOption("showNews", function (val) {
            document.getElementById("shownews").checked = val;
        });
        readOption("titleText", function (val) {
            document.getElementById("titletext").value = val;
        });
        readOption("showTumblr", function (val) {
            document.getElementById("showtum").checked = val;
        });
        readOption("backgroundURL", function (val) {
            bgPreview.style.backgroundImage = val;
        });
        readOption("autoClose", function (val) {
            document.getElementById("autoclose").checked = val;
        });
    });
});

document.getElementById("save").onclick = function () {
    var newSettings = defaultSettings;

    delete newSettings.backgroundURL;

    newSettings.slotCount = Number(document.getElementById("slotcount").value);
    newSettings.titleText = document.getElementById("titletext").value;
    newSettings.showWeather = document.getElementById("showWeather").checked;
    newSettings.showFB = document.getElementById("showfb").checked;
    newSettings.showFBNotif = document.getElementById("shownotif").checked;
    newSettings.showBookmarks = document.getElementById("showbookmarks").checked;
    newSettings.topSiteCount = Number(document.getElementById("topsitecount").value);
    newSettings.showStumble = document.getElementById("showstumble").checked;
    newSettings.showAllBookmarks = document.getElementById("showallbookmarks").checked;
    newSettings.bgBlur = document.getElementById("bgblur").checked;
    newSettings.useFahrenheit = document.getElementById("usefahrenheit").checked;
    newSettings.noAnimation = document.getElementById("disableanimation").checked;
    newSettings.showNews = document.getElementById("shownews").checked;
    newSettings.showTumblr = document.getElementById("showtum").checked;
    newSettings.autoClose = document.getElementById("autoclose").checked;

    newSettings.apps = defaultSettings.apps;

    var appLis = document.querySelectorAll("#appopts ol li");

    for (i = 0; i < appLis.length; i++) {
        var url = appLis[i].querySelector(".url").value;
        var icon = appLis[i].querySelector(".icon").value;

        newSettings.apps[i] = {
            url: url,
            icon: icon
        };
    }

    var syncDone = false;
    var localDone = false;

    chrome.storage.sync.set(newSettings, function () {
        syncDone = true;
        if (syncDone && localDone) {
            window.top.location.reload();
        }
    });

    chrome.storage.local.set({
        backgroundURL: bgPreview.style.backgroundImage
    }, function () {
        localDone = true;
        if (syncDone && localDone) {
            window.top.location.reload();
        }
    });
};

document.getElementById("exportopts").onclick = function () {
    window.location = "/options/export.html";
};

document.querySelector("#bglocalfacade").onclick = function () {
    document.querySelector("#bglocal").click();
};

/* shh! super-secret easter egg stuff! */
/* tell no-one */

function easterEgg() {
    if (window.eggIndex === undefined) {
        window.eggIndex = 0;
    }

    if (window.eggTitles === undefined) {
        window.eggTitles = ["New New New Tab Page", "2new4me Tab Page", "#yeya", "Page Tab New New", "<pre>new NewTabPage();</pre>", "Do you like waffles?", "Neue Neue Tab Page", "Tab Page &Uuml;berneue", "New-ish Tab Page", "&Uuml;berneue Registerkarte", "Heil NNTP!", "Not a New Tab Page", "Want a huggy?", "<span>(n) A doubly recently developed HTML document designed to start out multiple browsing contexts on the World Wide Web.</span>", "N3W N3W 74B P493", "&#9731;", "n3w n3w 7@b p493", "#nntp4lyf", "#yolo #sweg", "<span>New New Tab Page, now available for Internet Explorer!</span>", "#b0rnInab4rn", "<span>lul pc peasents #consolemasturraic</span>", "<span>Smosh isn't funny anymore</span>", "#sherlock2016", "<span>lol u use an iphone? #iSheep</span>", "<span>Don't you have better things to do?</span>", "Gyt sum werk dun, scrub", "&nbsp;", "&nbsp;", "&nbsp;", "boo", "LOL U JUST GOT PRANKD", "Ughh...", "Hey Scotty", "#jesusman", "What are you still doing here?", "Go play Flappy Bird"];
    }

    if (eggIndex === eggTitles.length) {
        document.querySelector("h1").innerHTML = "New New Tab Page";
    } else {
        document.querySelector("h1").innerHTML = eggTitles[eggIndex];
        eggIndex += 1;
    }
}

document.forms[0].onsubmit = function(e){
    e.preventDefault();
};