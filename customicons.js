window.onload = function(){
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
    document.getElementById("slot1usec").value = localStorage.slot1usec || "false";
    document.getElementById("slot2usec").value = localStorage.slot2usec || "false";
    document.getElementById("slot3usec").value = localStorage.slot3usec || "false";
    document.getElementById("slot4usec").value = localStorage.slot4usec || "false";
    document.getElementById("slot5usec").value = localStorage.slot5usec || "false";
    document.getElementById("slot6usec").value = localStorage.slot6usec || "false";
    document.getElementById("slot7usec").value = localStorage.slot7usec || "false";
    document.getElementById("slot8usec").value = localStorage.slot8usec || "false";
    document.getElementById("slot9usec").value = localStorage.slot9usec || "false";
    document.getElementById("slot10usec").value = localStorage.slot10usec || "false";
    document.getElementById("slot11usec").value = localStorage.slot11usec || "false";
    document.getElementById("slot12usec").value = localStorage.slot12usec || "false";
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
    document.getElementsByClassName("save")[6].onclick = function(){
        localStorage.slot7ic = document.getElementsByClassName("ico")[6].value;
        localStorage.slot7uc = document.getElementsByClassName("url")[6].value;
        localStorage.slot7usec = document.getElementById("slot7usec").value;
        this.value = "Saved";
    }
    document.getElementsByClassName("save")[7].onclick = function(){
        localStorage.slot8ic = document.getElementsByClassName("ico")[7].value;
        localStorage.slot8uc = document.getElementsByClassName("url")[7].value;
        localStorage.slot8usec = document.getElementById("slot8usec").value;
        this.value = "Saved";
    }
    document.getElementsByClassName("save")[8].onclick = function(){
        localStorage.slot9ic = document.getElementsByClassName("ico")[8].value;
        localStorage.slot9uc = document.getElementsByClassName("url")[8].value;
        localStorage.slot9usec = document.getElementById("slot9usec").value;
        this.value = "Saved";
    }
    document.getElementsByClassName("save")[9].onclick = function(){
        localStorage.slot10ic = document.getElementsByClassName("ico")[9].value;
        localStorage.slot10uc = document.getElementsByClassName("url")[9].value;
        localStorage.slot10usec = document.getElementById("slot10usec").value;
        this.value = "Saved";
    }
    document.getElementsByClassName("save")[10].onclick = function(){
        localStorage.slot11ic = document.getElementsByClassName("ico")[10].value;
        localStorage.slot11uc = document.getElementsByClassName("url")[10].value;
        localStorage.slot11usec = document.getElementById("slot11usec").value;
        this.value = "Saved";
    }
    document.getElementsByClassName("save")[11].onclick = function(){
        localStorage.slot12ic = document.getElementsByClassName("ico")[11].value;
        localStorage.slot12uc = document.getElementsByClassName("url")[11].value;
        localStorage.slot12usec = document.getElementById("slot12usec").value;
        this.value = "Saved";
    }
}