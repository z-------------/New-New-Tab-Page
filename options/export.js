var exportBox = document.querySelector("#export textarea")
var importBox = document.querySelector("#import textarea")
var importButton = document.querySelector("#import button")

chrome.storage.sync.get(null, function(r) {
  exportBox.value = JSON.stringify(r)
})

importButton.onclick = function() {
  if (confirm(chrome.i18n.getMessage("importexportOverwriteConfirmation"))) {
    chrome.storage.sync.set(JSON.parse(importBox.value), function() {
      alert(chrome.i18n.getMessage("importexportSuccessMessage"))
      window.top.location.reload()
    })
  }
}

document.querySelector("#backbtn").onclick = function(e) {
  e.preventDefault()
  history.back()
}