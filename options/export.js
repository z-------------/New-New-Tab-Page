var exportbox = document.getElementById("export");
var importbox = document.getElementById("import");
var importbutton = document.getElementById("importb");

exportbox.value = JSON.stringify(localStorage);

importbutton.onclick = function(){
    var confBool = confirm("Are you sure you want to overwrite your current settings?");
    if (confBool) {
        var newls = JSON.parse(importbox.value);
        var lskeys = Object.keys(newls);
        for (i in lskeys) {
            localStorage[lskeys[i]] = newls[lskeys[i]];
        }
        alert("Done importing :D");
    }
}