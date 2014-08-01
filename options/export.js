var exportBox = document.querySelector("#export textarea");
var importBox = document.querySelector("#import textarea");
var importButton = document.querySelector("#import button");

chrome.storage.sync.get(null, function (r) {
    exportBox.value = JSON.stringify(r);
});

importButton.onclick = function () {
    if (confirm("Are you sure you want to overwrite your current options?")) {
        chrome.storage.sync.set(JSON.parse(importBox.value), function () {
            alert("Finished importing :D");
            window.top.location.reload();
        });
    }
};

document.querySelector("#backbtn").onclick = function (e) {
    e.preventDefault();
    history.back();
};