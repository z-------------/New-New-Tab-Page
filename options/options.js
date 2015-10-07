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
    showAppsDrawer: true,
    topSiteCount: 6,
    recSiteCount: 3,
    showBookmarks: false,
    showAllBookmarks: false,
    firstRun: false,
    backgroundURL: "url(/img/bg.png)",
    bgBlur: false,
    titleText: "New Tab",
    autoClose: true,
    noAnimation: false,
    useFahrenheit: false,
    appIconSize: 130,
    showFB: false,
    showFBNotif: false,
    sidebarEnabled: true,
    appsgridstyle: false,
    feedurls: [
        "http://feeds.bbci.co.uk/news/world/rss.xml"
    ]
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

// resize background preview to fit screen size
function resizeBgPreview() {
    bgPreview.style.height = 300 * window.top.innerHeight / window.top.innerWidth + "px";
}
window.top.addEventListener("resize", resizeBgPreview);
resizeBgPreview();

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
        readOption("showFB", function (val) {
            document.getElementById("showfb").checked = val;
        });
        readOption("showFBNotif", function (val) {
            document.getElementById("shownotif").checked = val;
        });
        readOption("appIconSize", function (val) {
            document.getElementById("appiconsize").value = val;
        });
        readOption("showBookmarks", function (val) {
            document.getElementById("showbookmarks").checked = val;
        });
        readOption("topSiteCount", function (val) {
            document.getElementById("topsitecount").value = val;
        });
        readOption("recSiteCount", function (val) {
            document.getElementById("recsitecount").value = val;
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
        readOption("titleText", function (val) {
            document.getElementById("titletext").value = val;
        });
        readOption("backgroundURL", function (val) {
            bgPreview.style.backgroundImage = val;
        });
        readOption("autoClose", function (val) {
            document.getElementById("autoclose").checked = val;
        });
        readOption("sidebarEnabled", function (val) {
            document.getElementById("sidebarenabled").checked = val;
        });
        readOption("appsgridstyle", function (val) {
            document.getElementById("appsgridstyle").checked = val;
        });
        readOption("feedurls", function (val) {
            document.getElementById("feedurls").value = val.join("\n");
        });
    });
});

document.getElementById("save").onclick = function () {
    var newSettings = defaultSettings;

    delete newSettings.backgroundURL;

    newSettings.showFB = document.getElementById("showfb").checked;
    newSettings.showFBNotif = document.getElementById("shownotif").checked;
    newSettings.appIconSize = Number(document.getElementById("appiconsize").value);
    newSettings.titleText = document.getElementById("titletext").value;
    newSettings.showBookmarks = document.getElementById("showbookmarks").checked;
    newSettings.topSiteCount = Number(document.getElementById("topsitecount").value);
    newSettings.recSiteCount = Number(document.getElementById("recsitecount").value);
    newSettings.showAllBookmarks = document.getElementById("showallbookmarks").checked;
    newSettings.bgBlur = document.getElementById("bgblur").checked;
    newSettings.useFahrenheit = document.getElementById("usefahrenheit").checked;
    newSettings.noAnimation = document.getElementById("disableanimation").checked;
    newSettings.autoClose = document.getElementById("autoclose").checked;
    newSettings.sidebarEnabled = document.getElementById("sidebarenabled").checked;
    newSettings.appsgridstyle = document.getElementById("appsgridstyle").checked;
    newSettings.feedurls = document.getElementById("feedurls").value.split("\n");

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
        window.eggTitles = ["New New New Tab Page", "2new4me Tab Page", "#yeya", "Page Tab New New", "<pre>new NewTabPage();</pre>", "Neue Neue Tab Page", "Tab Page &Uuml;berneue", "New-ish Tab Page", "&Uuml;berneue Registerkarte", "Not a New Tab Page", "<span>(n) A doubly recently developed HTML document designed to start out multiple browsing contexts on the World Wide Web.</span>", "N3W N3W 74B P493", "&#9731;", "n3w n3w 7@b p493", "#nntp4lyf", "#yolo #sweg", "<span>New New Tab Page, now available for Internet Explorer</span>", "<span>lul pc peasents #consolemasturraic</span>", "<span>Smosh isn't funny anymore</span>", "#sherlock2016", "<span>Don't you have better things to do?</span>", "&nbsp;", "&nbsp;", "&nbsp;", "boo", "LOL U JUST GOT PRANKD", "What are you still doing here?", "Go play Flappy Bird"];
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

document.querySelector("#edit-apps-btn").addEventListener("click", function(){
    window.top.document.querySelector("#optionbutton").click();
    setTimeout(window.top.openAppsEditor, 300);
});
