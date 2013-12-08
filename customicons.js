window.onload = function(){
    document.getElementsByClassName("url")[0].value = localStorage.slot1uc || "";
    document.getElementsByClassName("url")[1].value = localStorage.slot2uc || "";
    document.getElementsByClassName("url")[2].value = localStorage.slot3uc || "";
    document.getElementsByClassName("url")[3].value = localStorage.slot4uc || "";
    document.getElementsByClassName("url")[4].value = localStorage.slot5uc || "";
    document.getElementsByClassName("url")[5].value = localStorage.slot6uc || "";
    document.getElementsByClassName("ico")[0].value = localStorage.slot1ic || "";
    document.getElementsByClassName("ico")[1].value = localStorage.slot2ic || "";
    document.getElementsByClassName("ico")[2].value = localStorage.slot3ic || "";
    document.getElementsByClassName("ico")[3].value = localStorage.slot4ic || "";
    document.getElementsByClassName("ico")[4].value = localStorage.slot5ic || "";
    document.getElementsByClassName("ico")[5].value = localStorage.slot6ic || "";
    document.getElementById("slot1usec").value = localStorage.slot1usec || "false";
    document.getElementById("slot2usec").value = localStorage.slot2usec || "false";
    document.getElementById("slot3usec").value = localStorage.slot3usec || "false";
    document.getElementById("slot4usec").value = localStorage.slot4usec || "false";
    document.getElementById("slot5usec").value = localStorage.slot5usec || "false";
    document.getElementById("slot6usec").value = localStorage.slot6usec || "false";
    document.getElementsByClassName("save")[0].onclick = function(){
        localStorage.slot1ic = document.getElementsByClassName("ico")[0].value;
        localStorage.slot1uc = document.getElementsByClassName("url")[0].value;
        localStorage.slot1usec = document.getElementById("slot1usec").value;
        this.value = "Saved";
    }
    document.getElementsByClassName("save")[1].onclick = function(){
        localStorage.slot2ic = document.getElementsByClassName("ico")[1].value;
        localStorage.slot2uc = document.getElementsByClassName("url")[1].value;
        localStorage.slot2usec = document.getElementById("slot2usec").value;
        this.value = "Saved";
    }
    document.getElementsByClassName("save")[2].onclick = function(){
        localStorage.slot3ic = document.getElementsByClassName("ico")[2].value;
        localStorage.slot3uc = document.getElementsByClassName("url")[2].value;
        localStorage.slot3usec = document.getElementById("slot3usec").value;
        this.value = "Saved";
    }
    document.getElementsByClassName("save")[3].onclick = function(){
        localStorage.slot4ic = document.getElementsByClassName("ico")[3].value;
        localStorage.slot4uc = document.getElementsByClassName("url")[3].value;
        localStorage.slot4usec = document.getElementById("slot4usec").value;
        this.value = "Saved";
    }
    document.getElementsByClassName("save")[4].onclick = function(){
        localStorage.slot5ic = document.getElementsByClassName("ico")[4].value;
        localStorage.slot5uc = document.getElementsByClassName("url")[4].value;
        localStorage.slot5usec = document.getElementById("slot5usec").value;
        this.value = "Saved";
    }
    document.getElementsByClassName("save")[5].onclick = function(){
        localStorage.slot6ic = document.getElementsByClassName("ico")[5].value;
        localStorage.slot6uc = document.getElementsByClassName("url")[5].value;
        localStorage.slot6usec = document.getElementById("slot6usec").value;
        this.value = "Saved";
    }
}