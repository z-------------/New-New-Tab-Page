let i18nElems = document.querySelectorAll("[data-msg-name]")
for (let i = 0, l = i18nElems.length; i < l; i++) {
  let elem = i18nElems[i]
  // let message = chrome.i18n.getMessage(elem.dataset.msgName);
  // if (message && message.length > 0) {
  //   elem.textContent = message;
  // }
  elem.textContent = chrome.i18n.getMessage(elem.dataset.msgName)
}

let i18nTemplateElems = document.querySelectorAll("[data-msg-template]")
for (let i = 0, l = i18nTemplateElems.length; i < l; i++) {
  let elem = i18nTemplateElems[i]
  let messageKeys = elem.dataset.msgTemplate.match(/\${\w+}/g).map(function(str) { return str.substring(2, str.length - 1) })
  var finalString = elem.dataset.msgTemplate
  for (let j = 0, m = messageKeys.length; j < m; j++) {
    let messageKey = messageKeys[j]
    let pattern = new RegExp("\\${" + messageKey + "}", "g")
    finalString = finalString.replace(pattern, chrome.i18n.getMessage(messageKey))
  }
  elem.textContent = finalString
}

let i18nAttrMapElems = document.querySelectorAll("[data-msg-attr-map]")
for (let i = 0, l = i18nAttrMapElems.length; i < l; i++) {
  let elem = i18nAttrMapElems[i]
  let mappings = elem.dataset.msgAttrMap.split(";").map(function(val) {
    return val.split(":")
  })
  for (let j = 0, m = mappings.length; j < m; j++) {
    let mapping = mappings[j]
    elem.setAttribute(mapping[0], chrome.i18n.getMessage(mapping[1]))
  }
}
