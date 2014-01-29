document.addEventListener("DOMContentLoaded",function(){
    document.querySelector("input[value=Continue]").addEventListener("click",function(){
        localStorage.firstRun = "false";
        window.location = "newtab.html";
    })
})