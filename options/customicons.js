function move() {
    var direction = this.getAttribute("data-direction");
    var index = parseInt(this.getAttribute("data-index"));
    
    var map = {
        up: -1,
        down: 1
    };
    var n = map[direction];
    
    var otherval = {};
    otherval.url = document.querySelectorAll(".url")[index+n].value;
    otherval.icon = document.querySelectorAll(".ico")[index+n].value;
    otherval.use = document.querySelectorAll("[type=checkbox]")[index+n].checked;
    
    var thisval = {};
    thisval.url = document.querySelectorAll(".url")[index].value;
    thisval.icon = document.querySelectorAll(".ico")[index].value;
    thisval.use = document.querySelectorAll("[type=checkbox]")[index].checked;
    
    document.querySelectorAll(".url")[index+n].value = thisval.url;
    document.querySelectorAll(".ico")[index+n].value = thisval.icon;
    document.querySelectorAll("[type=checkbox]")[index+n].checked = thisval.use;
    
    document.querySelectorAll(".url")[index].value = otherval.url;
    document.querySelectorAll(".ico")[index].value = otherval.icon;
    document.querySelectorAll("[type=checkbox]")[index].checked = otherval.use;
}

document.getElementsByClassName("url")[0].value = localStorage.slot1uc || "";
document.getElementsByClassName("url")[1].value = localStorage.slot2uc || "";
document.getElementsByClassName("url")[2].value = localStorage.slot3uc || "";
document.getElementsByClassName("url")[3].value = localStorage.slot4uc || "";
document.getElementsByClassName("url")[4].value = localStorage.slot5uc || "";
document.getElementsByClassName("url")[5].value = localStorage.slot6uc || "";
document.getElementsByClassName("url")[6].value = localStorage.slot7uc || "";
document.getElementsByClassName("url")[7].value = localStorage.slot8uc || "";
document.getElementsByClassName("url")[8].value = localStorage.slot9uc || "";
document.getElementsByClassName("url")[9].value = localStorage.slot10uc || "";
document.getElementsByClassName("url")[10].value = localStorage.slot11uc || "";
document.getElementsByClassName("url")[11].value = localStorage.slot12uc || "";
document.getElementsByClassName("ico")[0].value = localStorage.slot1ic || "";
document.getElementsByClassName("ico")[1].value = localStorage.slot2ic || "";
document.getElementsByClassName("ico")[2].value = localStorage.slot3ic || "";
document.getElementsByClassName("ico")[3].value = localStorage.slot4ic || "";
document.getElementsByClassName("ico")[4].value = localStorage.slot5ic || "";
document.getElementsByClassName("ico")[5].value = localStorage.slot6ic || "";
document.getElementsByClassName("ico")[6].value = localStorage.slot7ic || "";
document.getElementsByClassName("ico")[7].value = localStorage.slot8ic || "";
document.getElementsByClassName("ico")[8].value = localStorage.slot9ic || "";
document.getElementsByClassName("ico")[9].value = localStorage.slot10ic || "";
document.getElementsByClassName("ico")[10].value = localStorage.slot11ic || "";
document.getElementsByClassName("ico")[11].value = localStorage.slot12ic || "";
document.getElementById("slot1usec").checked = eval(localStorage.slot1usec) || false;
document.getElementById("slot2usec").checked = eval(localStorage.slot2usec) || false;
document.getElementById("slot3usec").checked = eval(localStorage.slot3usec) || false;
document.getElementById("slot4usec").checked = eval(localStorage.slot4usec) || false;
document.getElementById("slot5usec").checked = eval(localStorage.slot5usec) || false;
document.getElementById("slot6usec").checked = eval(localStorage.slot6usec) || false;
document.getElementById("slot7usec").checked = eval(localStorage.slot7usec) || false;
document.getElementById("slot8usec").checked = eval(localStorage.slot8usec) || false;
document.getElementById("slot9usec").checked = eval(localStorage.slot9usec) || false;
document.getElementById("slot10usec").checked = eval(localStorage.slot10usec) || false;
document.getElementById("slot11usec").checked = eval(localStorage.slot11usec) || false;
document.getElementById("slot12usec").checked = eval(localStorage.slot12usec) || false;

var moves = document.querySelectorAll(".move");
var moveUps = document.querySelectorAll(".move.up");
var moveDowns = document.querySelectorAll(".move.down");

for (i=0;i<moves.length;i+=2) {
    moves[i].setAttribute("data-index",i/2); // up
    moves[i].setAttribute("data-direction","up");
    
    moves[i+1].setAttribute("data-index",i/2); // down
    moves[i+1].setAttribute("data-direction","down");
    
    moves[i].onclick = move;
    moves[i+1].onclick = move;
}

document.getElementById("save").onclick = function(){
    for(i=0;i<document.getElementsByClassName("url").length;i++) {
        localStorage["slot"+(i+1)+"uc"] = document.getElementsByClassName("url")[i].value;
        localStorage["slot"+(i+1)+"ic"] = document.getElementsByClassName("ico")[i].value;
        localStorage["slot"+(i+1)+"usec"] = document.querySelectorAll("[type=checkbox]")[i].checked;
    }
    this.value = "Saved";
}