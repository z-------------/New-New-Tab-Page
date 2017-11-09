let i18nElems = document.querySelectorAll("[data-msg-name]");
for (let i = 0, l = i18nElems.length; i < l; i++) {
  let elem = i18nElems[i];
  let message = chrome.i18n.getMessage(elem.dataset.msgName);
  if (message && message.length > 0) {
    elem.textContent = message;
  }
}
