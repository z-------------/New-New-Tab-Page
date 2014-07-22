document.querySelector("input[value=Continue]").addEventListener("click",function(){
    chrome.storage.sync.set({firstRun: false}, function(){
		window.location = "/newtab.html";
	});
});