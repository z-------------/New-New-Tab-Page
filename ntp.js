var storage = chrome.storage.sync

var xhr = function(url, callback, errCallback) {
  var oReq = new XMLHttpRequest()
  oReq.onload = function() {
    var response = this.responseText
    callback(response)
  }
  oReq.onerror = function(e) {
    if (errCallback) errCallback(e)
    else console.warn(`xhr error:`, e)
  }
  oReq.open("get", url, true)
  oReq.send()
}

var settings

xhr(chrome.extension.getURL("/consts/default_settings.json"), function(res) {
  settings = JSON.parse(res).default_settings

  String.prototype.getDomain = function() {
    var temp = document.createElement("a")
    temp.href = this
    return temp.protocol + "//" + temp.host
  }

  String.prototype.getPureDomain = function() {
    var temp = document.createElement("a")
    temp.href = this

    var val = temp.host
    if (val.indexOf("www") === 0) val = val.substring(val.indexOf("www.") + "www.".length)

    return val
  }

  String.prototype.getHostname = function() {
    var temp = document.createElement("a")
    temp.href = this

    var val = temp.hostname
    if (val.indexOf("www") === 0) val = val.substring(val.indexOf("www.") + "www.".length)

    return val
  }

  function iconBGColor(url) {
    var img = document.createElement("img")
    img.src = url

    var width = img.width
    var height = img.height

    var canvas = document.createElement("canvas")
    var ctx = canvas.getContext("2d")

    canvas.width = width
    canvas.height = height

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    ctx.drawImage(img, 0, 0)

    var data
    var sum = {
      r: 0,
      g: 0,
      b: 0
    }

    try {
      data = ctx.getImageData(0, 0, width, height).data

      for (let i = 0, l = width * 4; i < l; i += 4) {
        sum.r += data[i]
        sum.g += data[i + 1]
        sum.b += data[i + 2]
      }

      for (let i = height * width * 4 - width * 4, l = height * width * 4; i < l; i += 4) {
        sum.r += data[i]
        sum.g += data[i + 1]
        sum.b += data[i + 2]
      }

      sum.r = Math.round(sum.r / (width * 2))
      sum.g = Math.round(sum.g / (width * 2))
      sum.b = Math.round(sum.b / (width * 2))

      return "rgb(" + sum.r + "," + sum.g + "," + sum.b + ")"
    } catch (e) {
      return "#ffffff"
    }
  }

  /* globals */
  var appsopened = 0,
    bmopened = 0,
    optsopened = 0,
    sidebarMouseInterval,
    sidebarMouseTime = 0

  var settingsKeys = Object.keys(settings)

  var defaultSlots = [{
    "icon": "/img/fb.png",
    "url": "http://www.facebook.com"
  }, {
    "icon": "/img/ng.png",
    "url": "http://9gag.com"
  }, {
    "icon": "/img/yt.png",
    "url": "http://www.youtube.com"
  }, {
    "icon": "/img/rd.png",
    "url": "http://www.reddit.com"
  }, {
    "icon": "/img/gp.png",
    "url": "https://plus.google.com"
  }, {
    "icon": "/img/gg.png",
    "url": "https://www.google.com"
  }, {
    "icon": "/img/yh.png",
    "url": "http://www.yahoo.com"
  }, {
    "icon": "/img/pk.png",
    "url": "http://getpocket.com/a/queue/"
  }, {
    "icon": "/img/tw.png",
    "url": "https://twitter.com"
  }, {
    "icon": "/img/gd.png",
    "url": "https://drive.google.com"
  }, {
    "icon": "/img/gk.png",
    "url": "https://drive.google.com/keep"
  }, {
    "icon": "/img/vg.png",
    "url": "http://www.theverge.com"
  }]

  var urlIconMap = {
    "facebook.com": "fb",
    "plus.google.com": "gp",
    "youtube.com": "yt",
    "9gag.com": "ng",
    "mail.google.com": "gm",
    "reddit.com": "rd",
    "google.com": "gg",
    "yahoo.com": "yh",
    "drive.google.com": "gd",
    "digg.com": "dg",
    "theverge.com": "vg",
    "twitter.com": "tw",
    "getpocket.com": "pk",
    "keep.google.com": "gk",
    "inbox.google.com": "ix",
    "ello.co": "el",
    "slack.com": "sk"
  }

  settings.apps = defaultSlots

  storage.get(settingsKeys, function(r) {
    var rKeys = Object.keys(r)
    for (let i = 0, l = rKeys.length; i < l; i++) {
      settings[rKeys[i]] = r[rKeys[i]]
    }

    settingsKeys = Object.keys(settings)
    for (let i = 0, l = settingsKeys.length; i < l; i++) {
      window[settingsKeys[i]] = settings[settingsKeys[i]] // copy settings into global namespace (lazy laze, that's why)
      // so i dont have to do settings.foo every time
    }

    chrome.storage.local.get(["backgroundURL", "background"], function(lr) {
      if (lr.background !== undefined) {
        window.background = lr.background
      }
      if (lr.backgroundURL !== undefined) {
        window.backgroundURL = lr.backgroundURL
      }

      main()

      if (lr.background === undefined) {
        var imageUri = window.backgroundURL.substring(4, window.backgroundURL.length - 1)
        if (imageUri[0] === "\"" && imageUri[imageUri.length - 1] === "\"") {
          imageUri = imageUri.substring(1, imageUri.length - 1)
        }

        var background = {
          images: [{
            type: "url",
            uri: imageUri
          }],
          background: {
            color: settings.background.background.color
          }
        }

        chrome.storage.local.remove("backgroundURL", function() {
          chrome.storage.local.set({ background: background }, function() {
            window.location.reload()
          })
        })
      }
    })
  })

  function main() {
    let bgElem = document.getElementById("bg"),
      whiteElem = document.getElementById("white"),
      container = document.getElementById("container"),
      drawer = document.getElementById("applist"),
      sidebar = document.getElementById("sidebar"),
      style = document.createElement("style")

    bgElem.style.backgroundImage = "url(" + (background.images[0].uri || settings.background.images[0].uri) + ")"
    if (bgBlur) {
      bgElem.style.webkitFilter = "blur(20px)"
    }

    style.type = "text/css"
    style.innerHTML = customCSS
    document.getElementsByTagName("head")[0].appendChild(style)

    function openIconURL(index, e) {
      let url = apps[index].url
      let element = container.children[index]
      if (!document.querySelector("#apps-editor-container").classList.contains("opened")) {
        if (e.button === 1 || e.ctrlKey === true || e.metaKey === true) {
          chrome.tabs.create({ url, active: false })
        } else {
          chrome.tabs.getCurrent(function(r) {
            var currentTabId = r && r.id ? r.id : null
            white(element, function() {
              chrome.tabs.update(currentTabId, { url })
            })
          })
        }
      }
    }

    function sizeContainer() {
      if (
        settings.useFixedGrid === true &&
        settings.fixedGridCols &&
        settings.fixedGridRows
      ) {
        container.style.width = `${(appIconSize + 20) * settings.fixedGridCols}px`
        container.style.height = `${(appIconSize + 20) * settings.fixedGridRows}px`
        container.style.marginTop = `${-parseInt(container.style.height) / 2}px`
        container.style.marginLeft = `${-parseInt(container.style.width) / 2}px`
        container.classList.remove("autosize")
        container.classList.add("fixedgrid")
        if (parseInt(container.style.width) > window.innerWidth) {
          container.style.transform = `scale(${window.innerWidth / parseInt(container.style.width)})`
        }
        window.addEventListener("resize", function() {
          if (parseInt(container.style.width) > window.innerWidth) {
            container.style.transform = `scale(${window.innerWidth / parseInt(container.style.width)})`
          }
        })
      } else {
        if (slotCount < 7) {
          container.style.width = (appIconSize + 20) * slotCount + "px"
          container.style.height = (appIconSize + 20) + "px"
          container.style.marginTop = "-" + (appIconSize + 20) / 2 + "px"
          container.classList.remove("autosize")
          container.style.marginLeft = -parseInt(container.style.width) / 2 + "px"
        } else if (slotCount <= 12) {
          container.style.height = 2*(appIconSize + 20) + "px"
          container.style.marginTop = "-" + (appIconSize + 20) + "px"

          container.style.width = Math.ceil(slotCount / 2) * (appIconSize + 20) + "px"
          container.classList.remove("autosize")
          container.style.marginLeft = -parseInt(container.style.width) / 2 + "px"
        } else {
          container.style.height = null
          container.style.marginTop = null
          container.style.marginLeft = null
          container.style.width = null
          container.classList.add("autosize")
        }
      }
    }

    for (let i = 0; i < slotCount; i++) {
      var thisApp = document.createElement("div")
      thisApp.classList.add("app")

      //middle click moved from 'click' event to 'auxclick' event between chrome versions 52 and 55
      thisApp.addEventListener("auxclick", function(e) {
        if(e.button === 1) { //middle click only, not right click.
          openIconURL([].slice.call(this.parentElement.children).indexOf(this), e)
        }
      })

      thisApp.addEventListener("click", function(e) {
        openIconURL([].slice.call(this.parentElement.children).indexOf(this), e)
      })

      thisApp.addEventListener("mouseenter", function() {
        colorWhite(this)
      })

      thisApp.style.width = appIconSize + "px"
      thisApp.style.height = appIconSize + "px"
      thisApp.style.borderRadius = appIconBorderRadius + "%"

      if (apps[i]) {
        thisApp.style.backgroundImage = "url(" + apps[i].icon + ")"
        thisApp.dataset.url = apps[i].url
      } else { // not defined, go to defaults
        thisApp.style.backgroundImage = "url(" + defaultSlots[i].icon + ")"
        thisApp.dataset.url = defaultSlots[i].url
      }

      document.getElementById("container").appendChild(thisApp)
    }

    sizeContainer()

    document.getElementById("title").innerHTML = titleText

    window.openAppsEditor = function() {
      let editorElem = document.getElementById("apps-editor"),
        editorBtnsElem = document.getElementById("apps-editor-buttons")
      document.getElementById("apps-editor-container").classList.add("opened")

      let urlInput = document.getElementById("editor-url"),
        iconInput = document.getElementById("editor-icon"),
        fetchIconBtn = document.getElementById("editor-fetchicon"),
        saveBtn = document.getElementById("editor-save"),
        cancelBtn = document.getElementById("editor-cancel"),
        closeBtn = document.getElementById("editor-closeeditor")

      var addAppBtn = document.createElement("div")
      addAppBtn.classList.add("editor-addapp")
      addAppBtn.style.height = appIconSize + "px"

      var appElems = document.querySelectorAll(".app")

      function fetchIcon(url, callback) {
        var presetMatchedId

        if (urlIconMap.hasOwnProperty(url.getPureDomain())) {
          presetMatchedId = urlIconMap[url.getPureDomain()]
        }

        if (presetMatchedId) {
          callback("/img/" + presetMatchedId + ".png")
        } else {
          xhr(url, function(r) {
            parser = new DOMParser()
            doc = parser.parseFromString(r, "text/html")

            var linkTags = doc.getElementsByTagName("link")
            var icons = [].slice.call(linkTags).filter(function(tag) {
              var attrRel = tag.getAttribute("rel")
              return attrRel === "apple-touch-icon-precomposed" || attrRel === "apple-touch-icon" || attrRel === "shortcut icon" || attrRel === "icon"
            })

            var sizePreference = ["57x57", "60x60", "72x72", "76x76", "96x96", "114x114", "120x120", "144x144", "152x152", "180x180", "192x192"]

            icons.sort(function(a, b) {
              var sizeA = a.getAttribute("sizes")
              var sizeB = b.getAttribute("sizes")
              if (sizePreference.indexOf(sizeA) > sizePreference.indexOf(sizeB)) return -1
              if (sizePreference.indexOf(sizeA) < sizePreference.indexOf(sizeB)) return 1
              return 0
            })

            var icon = URI("favicon.ico").absoluteTo(url).toString()
            if (icons.length > 0) {
              var iconElem = icons[0]
              var iconHrefAttr = iconElem.getAttribute("href")
              icon = URI(iconHrefAttr).absoluteTo(url).toString()
            }

            callback(icon)
          })
        }
      }

      function updateApp(index, key, value) {
        if (key === "url") {
          appElems[index].dataset.url = value
        }
        if (key === "icon") {
          appElems[index].style.backgroundImage = "url(" + value + ")"
        }
      }

      function saveApps() {
        [].slice.call(document.querySelectorAll(".app")).forEach(function(elem, i) {
          var url = elem.dataset.url

          var bgImg = elem.style.backgroundImage
          var icon = bgImg.substring(4, bgImg.length - 1)
          if (icon[0] === "\"" && icon[icon.length - 1] === "\"") {
            icon = icon.substring(1, icon.length - 1) // remove quotes if present
          }

          if (!apps[i]) {
            apps[i] = {}
          }

          apps[i].url = url
          apps[i].icon = icon
        })

        storage.set({
          apps: apps,
          slotCount: slotCount
        }, function() {
          location.reload()
        })
      }

      function positionEditor(appElem) {
        containerRects = container.getClientRects()[0]
        appRects = appElem.getClientRects()[0]
        editorRects = editorElem.getClientRects()[0]

        editorElem.style.marginLeft = null
        editorElem.style.marginRight = null
        editorElem.style.left = appRects.left + appRects.width / 2 - editorRects.width / 2 + "px"
        editorElem.style.top = appRects.top - editorRects.height - 20 + "px"

        editorRects = editorElem.getClientRects()[0]
        // console.log(editorRects)
        if (editorRects.left < 0) {
          editorElem.style.marginLeft = Math.abs(editorRects.left) + "px"
        } else if (editorRects.right > window.innerWidth) {
          editorElem.style.marginRight = Math.abs(editorRects.right - window.innerWidth) + "px"
        }
      }

      function positionEditorBtns() {
        // if (container.classList.contains("fixedgrid")) {
        //   editorBtnsElem.style.left = container.offsetLeft + "px"
        //   editorBtnsElem.style.top = container.offsetTop + container.offsetHeight + "px"
        //   editorBtnsElem.style.width = container.offsetWidth + "px"
        // } else {
        //   editorBtnsElem.style.left = container.offsetLeft + "px"
        //   editorBtnsElem.style.top = container.offsetTop - editorBtnsElem.offsetHeight + "px"
        //   editorBtnsElem.style.width = container.offsetWidth + "px"
        // }
        editorBtnsElem.style.left = container.offsetLeft + "px"
        editorBtnsElem.style.top = container.offsetTop - editorBtnsElem.offsetHeight + "px"
        editorBtnsElem.style.width = container.offsetWidth + "px"
        if (container.classList.contains("fixedgrid")) {
          editorBtnsElem.style.transform = container.style.transform
        }
      }

      function editApp(appElem) {
        appElems = document.querySelectorAll(".app")

        appElem.classList.add("editing")

        var index = [].slice.call(appElems).indexOf(appElem)

        ;[].slice.call(appElems).forEach(function(elem) {
          if (elem !== appElem) elem.classList.remove("editing")
        })

        urlInput.value = appElem.dataset.url

        var bgImg = appElem.style.backgroundImage
        iconInput.value = bgImg.substring(5, bgImg.length - 2)

        urlInput.onchange = function() {
          if (this.value.indexOf("://") === -1) this.value = "http://" + this.value
          updateApp(index, "url", this.value)
        }

        iconInput.onchange = function() {
          updateApp(index, "icon", this.value)
        }

        fetchIconBtn.onclick = function() {
          fetchIcon(urlInput.value, function(r) {
            if (r) {
              iconInput.value = r
              iconInput.dispatchEvent(new Event("change"))
            }
          })
        }

        editorElem.style.display = "block"

        positionEditor(appElem)
        positionEditorBtns()
      }

      function addControls() {
        [].slice.call(document.querySelectorAll(".app")).forEach(function(elem) {
          elem.onclick = function() {
            editApp(this)
          }

          elem.innerHTML = "<button class='editor-remove'></button><button class='editor-move'></button>"

          elem.querySelector(".editor-remove").onclick = function(e) {
            e.stopPropagation()

            closeBtn.click()
            container.removeChild(this.parentElement)

            slotCount -= 1

            sizeContainer()
            positionEditorBtns()
          }
        })
      }

      addControls()

      saveBtn.onclick = saveApps
      cancelBtn.onclick = function() {
        location.reload()
      }

      closeBtn.onclick = function() {
        if (document.querySelector(".app.editing")) document.querySelector(".app.editing").classList.remove("editing")
        editorElem.style.display = "none"
      }

      window.addEventListener("resize", function() {
        positionEditor(document.querySelector(".app.editing"))
        positionEditorBtns()
      })

      addAppBtn.onclick = function() {
        var index = appElems.length

        var appElem = document.createElement("div")
        appElem.classList.add("app")

        var flooredIndex = Math.min(index, apps.length - 1)

        appElem.dataset.url = apps[flooredIndex].url
        appElem.style.backgroundImage = "url(" + apps[flooredIndex].icon + ")"

        container.insertBefore(appElem, addAppBtn)

        slotCount += 1

        sizeContainer()
        editApp(appElem)
        addControls()
        positionEditorBtns()
      }

      if (!container.querySelector(".editor-addapp")) container.appendChild(addAppBtn)

      editApp(appElems[0])

      chrome.topSites.get(function(res) {
        res.forEach(function(r) {
          var url = r.url
          document.getElementById("top-sites-datalist").innerHTML += "<option>" + url + "</option>"
        })

        if (!document.getElementById("awesomplete-script")) {
          var scriptElem = document.createElement("script")
          scriptElem.src = "js/Awesomplete/awesomplete.min.js"
          document.body.appendChild(scriptElem)

          var styleElem = document.createElement("link")
          styleElem.setAttribute("rel", "stylesheet")
          styleElem.href = "js/Awesomplete/awesomplete.css"
          document.head.appendChild(styleElem)

          scriptElem.onload = function() {
            new Awesomplete(urlInput, {
              list: "#top-sites-datalist",
              minChars: 1,
              autoFirst: true
            })
          }
        }
      })

      if (!document.getElementById("sortable-script")) {
        var scriptElem = document.createElement("script")
        scriptElem.src = "js/Sortable/Sortable.min.js"
        document.body.appendChild(scriptElem)

        scriptElem.onload = function() {
          Sortable.create(container, {
            draggable: ".app",
            handle: ".editor-move",
            onStart: function() {
              closeBtn.click()
            },
            onEnd: function() {
              addControls()
            },
            animation: 150
          })
        }
      }

      if (!document.getElementById("URI-script")) {
        var urijsScriptElem = document.createElement("script")
        urijsScriptElem.src = "js/URI.js/URI.min.js"
        document.body.appendChild(urijsScriptElem)
      }

      Object.keys(urlIconMap).forEach(function(url) {
        url = "http://" + url
        document.getElementById("top-sites-datalist").innerHTML += "<option>" + url + "</option>"
      })

      urlInput.addEventListener("awesomplete-selectcomplete", function() {
        urlInput.dispatchEvent(new Event("change"))
      })
    }

    var searchFocusTimeout

    document.getElementById("findbutton").onclick = function() {
      document.getElementById("drawer").style.top = "calc(100% - 70px)"

      this.style.opacity = "0"
      document.getElementById("optionbutton").style.opacity = "0"
      document.getElementById("bookmarks").style.opacity = "0"
      document.getElementById("appsicon").style.opacity = "0"
      document.getElementById("drawerarrow").style.opacity = "0"
      document.getElementById("bmarrow").style.opacity = "0"
      document.getElementById("search").value = ""

      searchFocusTimeout = setTimeout(function() {
        document.getElementById("search").focus()
      }, 200)
    }

    document.getElementById("close").onclick = function() {
      clearTimeout(searchFocusTimeout)

      document.getElementById("drawer").style.top = null
      document.getElementById("findbutton").style.opacity = null
      document.getElementById("bookmarks").style.opacity = null
      document.getElementById("appsicon").style.opacity = null

      document.getElementById("optionbutton").style.opacity = null
      document.getElementById("drawerarrow").style.opacity = null
      document.getElementById("bmarrow").style.opacity = null
    }

    document.getElementById("search").onkeydown = function(e) {
      if (e.which === 13) {
        window.location = "https://www.google.com/search?q=" + encodeURI(this.value) + "&btnI"
      }
    }

    document.getElementById("optionbutton").onclick = function() {
      const optionsUrl = "options/options.html"

      if (!options.src) { // it's the first time
        options.src = optionsUrl
        options.contentWindow.onload = function() {
          this.easterEgg() // `this` being the contentWindow
        }
      } else if (!optsopened && options.contentWindow.location.href.indexOf(optionsUrl) !== -1) {
        options.contentWindow.easterEgg()
      }

      if (optsopened) {
        document.body.classList.remove("optsopened")
        optsopened = 0
      } else {
        document.body.classList.add("optsopened")
        if (options.contentWindow.location.href.indexOf(optionsUrl) === -1) {
          options.contentWindow.location.href = optionsUrl
        }
        options.contentWindow.scrollTo(0, 0)
        optsopened = 1
      }
    }

    function getRecentSites(res) {
      if (recSiteCount >= 1 && res.length >= 1) {
        for (let i = 0, l = Math.min(recSiteCount, res.length); i < l; i++) {
          var recSite = res[i].tab

          var recentSitesList = document.getElementById("recentsites")

          var recSiteElem = document.createElement("a")
          recSiteElem.href = recSite.url
          recSiteElem.innerHTML = "<div class='draweritem topsite' id='l" + i + "'>" + recSite.title + "</div>"

          recSiteElem.getElementsByTagName("div")[0].style.backgroundImage = "url(" + recSite.favIconUrl + ")"

          recentSitesList.appendChild(recSiteElem)
        }
      } else {
        document.getElementById("recmostvis").style.display = "none"
      }
    }

    function getTopSites(res) {
      if (topSiteCount >= 1) {
        let topSitesElem = document.getElementById("topsites")
        for (let i = 0; i < topSiteCount; i++) {
          topSitesElem.innerHTML += `<a href="${res[i].url}"><div class="draweritem topsite" id="l${i}">${res[i].title || res[i].url}</div></a>`
          document.getElementById("l" + i).style.backgroundImage = "url(http://www.google.com/s2/favicons?domain=" + res[i].url.getDomain() + ")"
        }
      } else {
        document.getElementById("topmostvis").style.display = "none"
      }
    }

    function getApps(res) {
      var appsArray = []

      for (let i = 0, l = res.length; i < l; i++) {
        if ((res[i].type === "hosted_app" || res[i].type === "packaged_app" || res[i].type === "legacy_packaged_app") && res[i].enabled === true) {
          var appObject = {}
          appObject.name = res[i].name
          appObject.id = res[i].id
          appObject.icon = "chrome://extension-icon/" + appObject.id + "/128/0"
          appObject.clicks = Number(localStorage["app_clicks_" + appObject.id]) || 0

          appsArray.push(appObject)
        }
      }

      appsArray.sort(function(a, b) {
        if (a.clicks === b.clicks) {
          var aName = a.name.toLowerCase()
          var bName = b.name.toLowerCase()
          if (aName > bName) {
            return 1
          } else if (aName < bName) {
            return -1
          } else {
            return 0
          }
        }
        return b.clicks - a.clicks
      })

      for (let i = 0, l = appsArray.length - 1; i < l; i++) {
        var app = document.createElement("a")
        app.style.backgroundImage = "url(" + appsArray[i].icon + ")"
        app.classList.add("draweritem")
        app.classList.add("drawerapp")
        app.setAttribute("title", appsArray[i].name)
        app.innerHTML = appsArray[i].name
        app.dataset.id = appsArray[i].id

        app.addEventListener("click", function() {
          if (localStorage["app_clicks_" + this.dataset.id]) {
            localStorage["app_clicks_" + this.dataset.id] = Number(localStorage["app_clicks_" + this.dataset.id]) + 1
          } else {
            localStorage["app_clicks_" + this.dataset.id] = 1
          }
          chrome.management.launchApp(this.dataset.id)
          if (autoClose) {
            window.close()
          }
        })

        drawer.appendChild(app)
      }

      if (appsgridstyle) {
        drawer.classList.add("apps-gridstyle")
      }
    }

    if (showAppsDrawer) {
      chrome.topSites.get(getTopSites)
      chrome.sessions.getRecentlyClosed(getRecentSites)

      if (chrome.management.launchApp) {
        chrome.management.getAll(getApps)
      } else {
        document.getElementById("applist").classList.add("hidden")
      }

      document.getElementById("appsicon").style.display = "block"
      document.getElementById("appsicon").onclick = function() {
        if (!appsopened) {
          document.getElementById("appdrawerframe").classList.add("opened")
          document.getElementById("actualdrawer").scrollTop = 0
          appsopened = 1
          if (bmopened) {
            document.getElementById("bookmarks").click()
            bmopened = 0
          }
        } else if (appsopened) {
          document.getElementById("appdrawerframe").classList.remove("opened")
          appsopened = 0
        }
      }

      var appSearchBtn = document.getElementById("appsearchbtn")
      var appSearch = document.getElementById("appsearch")

      appSearchBtn.onclick = function() {
        document.getElementById("actualdrawer").classList.toggle("appsearch")

        if (document.getElementById("actualdrawer").classList.contains("appsearch")) {
          setTimeout(function() {
            appSearch.focus()
          }, 200)
        }
      }

      appSearch.oninput = function() {
        var appElems = document.querySelectorAll(".drawerapp")
        for (let i = 0, l = appElems.length; i < l; i++) {
          if (appElems[i].textContent.toLowerCase().indexOf(this.value.toLowerCase()) !== -1) {
            appElems[i].classList.remove("hidden")
          } else {
            appElems[i].classList.add("hidden")
          }
        }
      }
    }

    function getBookmarks(res) {
      let bookmarksListElem = document.getElementById("bookmarkslist")
      bookmarksListElem.innerHTML = ""
      if (document.getElementById("bmsearch").value === "") {
        bookmarksListElem.innerHTML = `<div id='bmsearchtip'>${chrome.i18n.getMessage("bookmarksEmptyMessage")}</div>`
      } else if (res.length > 0) {
        for (let i = 0, l = res.length; i < l; i++) {
          if (res[i].url.indexOf("javascript:") === -1 && res[i].url.indexOf("chrome://") === -1) {
            let aElem = document.createElement("a")
            aElem.href = res[i].url
            aElem.innerHTML = `<div class="bmsite" style="background-image: url(http://www.google.com/s2/favicons?domain=${res[i].url.substring(0, res[i].url.indexOf("/", 9))})">${res[i].title}</div>`
            bookmarksListElem.appendChild(aElem)
          }
        }
      } else {
        document.getElementById("bookmarkslist").innerHTML = `<div id='bmsearchtip'>${chrome.i18n.getMessage("bookmarksNoResultsMessage")}</div>`
      }
    }

    function getAllBookmarks(res) {
      document.getElementById("bookmarkslist").innerHTML = ""
      if (res.length > 0) {
        for (let i = 0, l = res.length; i < l; i++) {
          if (res[i].url.indexOf("javascript:") === -1) {
            let aElem = document.createElement("a")
            aElem.href = res[i].url
            aElem.innerHTML = `<div class="bmsite" style="background-image: url(http://www.google.com/s2/favicons?domain=${res[i].url.substring(0, res[i].url.indexOf("/", 9))})">${res[i].title}</div>`
          }
        }
      } else {
        document.getElementById("bookmarkslist").innerHTML = `<div id='bmsearchtip'>${chrome.i18n.getMessage("bookmarksNoBookmarksMessage")}</div>`
      }
    }

    if (showBookmarks) {
      document.getElementById("bookmarks").style.display = "block"
      document.getElementById("bookmarks").onclick = function() {
        if (!bmopened) {
          document.getElementById("bmdrawerframe").classList.add("opened")
          document.getElementById("bmsearch").value = ""
          chrome.bookmarks.search("", getBookmarks)

          bmopened = 1

          if (appsopened) {
            document.getElementById("appsicon").click()
            appsopened = 0
          }

          setTimeout(function() {
            document.getElementById("bmsearch").focus()
          }, 200)
        } else if (bmopened) {
          document.getElementById("bmdrawerframe").classList.remove("opened")

          bmopened = 0
        }
      }

      document.getElementById("bmsearch").oninput = function(e) {
        if (document.getElementById("bmsearch").value.length >= 3 || e.which === 13) {
          document.getElementById("bookmarkslist").scrollTop = 0
          chrome.bookmarks.search(this.value, getBookmarks)
        } else if (document.getElementById("bmsearch").value.length === 0) {
          chrome.bookmarks.search("", getBookmarks)
        }
      }

      if (showAllBookmarks) {
        setTimeout(function() {
          chrome.bookmarks.search("http", getAllBookmarks)
        }, 500)
      }
    }

    setInterval(function() {
      window.scrollTo(0, 0)
    }, 100)

    function colorWhite(element) {
      var rects = element.getClientRects()[0]
      var background = element.style.backgroundImage
      var iconURL = background.substring(4, background.lastIndexOf(")"))
      if (iconURL[0] === "\"" && iconURL[iconURL.length - 1] === "\"") {
        iconURL = iconURL.substring(1, iconURL.length - 1) // remove quotes if present
      }

      window.whiteFillColor = iconBGColor(iconURL)
      window.whiteX = rects.left + rects.width / 2
      window.whiteY = rects.top + rects.height / 2
    }

    function white(element, callback) {
      if (!noAnimation) {
        colorWhite(element)

        window.whiteContext = whiteElem.getContext("2d")
        window.whiteStartDate = new Date()
        window.whiteDuration = 350
        window.whiteRadius = (Math.max(window.innerWidth, window.innerHeight) + 45) * Math.sqrt(2)
        window.requestAnimationFrame(whiteStep)

        whiteElem.width = window.innerWidth
        whiteElem.height = window.innerHeight
      }

      // setTimeout(callback, transitionDuration)
      setTimeout(callback, 0)

      document.body.classList.add("no-interact");
    }

    function whiteStep() {
      var progress = Math.pow((new Date() - whiteStartDate) / whiteDuration, 2)

      // color circle
      whiteContext.fillStyle = whiteFillColor
      whiteContext.beginPath()
      whiteContext.arc(whiteX, whiteY, progress * whiteRadius, 0, 2 * Math.PI)
      whiteContext.fill()

      // lightener circle
      whiteContext.fillStyle = "rgba(255, 255, 255, " + progress + ")"
      whiteContext.beginPath()
      whiteContext.arc(whiteX, whiteY, progress * whiteRadius, 0, 2 * Math.PI)
      whiteContext.fill()

      if (progress < 1) {
        window.requestAnimationFrame(whiteStep)
      }
    }

    /* sidebar stuff */

    var sidebarFirstTime = true

    var sidebarOnFirstOpen = function() {
      /* weather */
      document.getElementById("weatherdiv").innerHTML = "<iframe id='weatherframe' src='weather/weather.html'></iframe>"

      /* news */
      function stripTags(html) {
        return html.replace(/(<([^>]+)>)/ig, "") // nifty regex by Chris Coyier of CSS-Tricks
      }

      function truncate(str) {
        if (str.length > 200) {
          return str.substring(0, 200) + "..."
        } else {
          return str
        }
      }

      function displayNews(items) {
        let newsListElem = document.getElementById("newslist");

        for (let i = 0, l = items.length; i < l; i++) {
          let publishedMoment = moment(items[i].published);

          let newsItemElem = document.createElement("a")
          newsItemElem.href = items[i].url
          newsItemElem.setAttribute("target", "_blank")

          newsItemElem.innerHTML = "<li class='news'>\
          <div class='news-content'>\
          <div class='news-header'>\
          <h3 class='news-title'>" + items[i].title + "</h3>\
          <div class='news-time--short'>" + publishedMoment.fromNow(true) + "</div>\
          </div>\
          <div class='news-text'>\
          <p>" + truncate(items[i].description) + "</p>\
          <div class='news-meta'>\
          <span>" + publishedMoment.fromNow() + "</span>\
           • \
          <span>" + items[i].author + "</span>\
          </div>\
          </div>\
          </div>\
          </li>"

          if (items[i].imageURL) {
            newsItemElem.querySelector("li.news").style.backgroundImage = "url(" + items[i].imageURL + ")"
          }

          newsListElem.appendChild(newsItemElem)
        }
        newsListElem.classList.remove("loading")
      }

      if (!document.getElementById("momentjs-script")) {
        var scriptElem = document.createElement("script")
        scriptElem.src = "js/Moment.js/moment-with-locales.min.js"
        scriptElem.setAttribute("id", "momentjs-script")
        document.body.appendChild(scriptElem)
        scriptElem.onload = function() {
          let uiLang = chrome.i18n.getUILanguage().toLowerCase(),
            uiLangTruncated = uiLang.split("-")[0]
          if (moment.locales().indexOf(uiLang) !== -1) {
            moment.locale(uiLang)
          } else if (moment.locales().indexOf(uiLangTruncated) !== -1) {
            moment.locale(uiLangTruncated)
          }

          var lastChecked = Number(localStorage.getItem("news_last_checked"))

          if (navigator.onLine) {
            if (!lastChecked || !localStorage.getItem("news_cache") || (new Date().getTime() - lastChecked >= 3.6E+6)) {
              var doneCount = 0;
              let items = [];

              for (let i = 0, l = feedurls.length; i < l; i++) {
                let url = "https://cloud.feedly.com/v3/mixes/contents?streamId=feed%2F" + encodeURIComponent(feedurls[i]) + "&count=20";
                xhr(url, function(r) {
                  if (r) {
                    let body = JSON.parse(r);
                    for (let j = 0, m = body.items.length; j < m; j++) {
                      let item = body.items[j];

                      var url
                      if (item.alternate && item.alternate.href) {
                        url = item.alternate.href
                      } else if (item.originId) {
                        url = item.originId
                      } else {
                        url = ""
                      }

                      var description
                      if (item.summary && item.summary.content) {
                        description = stripTags(item.summary.content).trim();
                      } else if (item.content && item.content.content) {
                        description = stripTags(item.content.content).trim();
                      } else {
                        description = item.title.trim();
                      }

                      var source = {
                        title: item.origin.title.trim(),
                        url: item.origin.htmlUrl
                      }

                      var author
                      if (item.author) {
                        author = `<a target='_blank' href='${source.url}'>${source.title}</a> • by ${item.author}`
                      } else {
                        author = `<a target='_blank' href='${source.url}'>${source.title}</a>`
                      }

                      var published = Number(item.published);

                      var imageURL = null
                      if (item.visual && item.visual.url && item.visual.url !== "none" && item.visual.contentType.match(/image\/*/gi)) {
                        imageURL = item.visual.url
                      } else if (item.thumbnail && item.thumbnail[0] && item.thumbnail[0].url) {
                        imageURL = item.thumbnail[item.thumbnail.length - 1].url
                      } else if (item.content && item.content.content) {
                        let parser = new DOMParser()
                        let doc = parser.parseFromString(item.content.content, "text/html")
                        let imageElems = doc.getElementsByTagName("img")
                        if (imageElems[0] && imageElems[0].getAttribute("src")) {
                          imageURL = imageElems[0].src
                        }
                      }

                      items.push({
                        title: item.title.trim(),
                        url: url,
                        description: description,
                        source: source,
                        author: author,
                        published: published,
                        imageURL: imageURL
                      })
                    }
                  }
                  doneCount++;

                  if (doneCount === feedurls.length) { // done fetching contents, move on
                    items = items.sort(function(a, b) {
                      if (a.published > b.published) return -1
                      if (a.published < b.published) return 1
                      return 0
                    })
                    displayNews(items)
                    localStorage.setItem("news_cache", JSON.stringify(items))
                    localStorage.setItem("news_last_checked", new Date().getTime().toString())
                  }
                })
              }

              document.getElementById("newslist").classList.add("loading")
            } else if (localStorage.getItem("news_cache")) {
              // console.log("using cached news")

              displayNews(JSON.parse(localStorage.getItem("news_cache")))
            } else {
              // console.log("gave up on news")

              document.getElementById("newslist").innerHTML = "<p class='error-msg'>Couldn't load news.</p>"
              document.getElementById("newslist").classList.remove("loading")
            }
          } else if (localStorage.getItem("news_cache")) {
            // console.log("using cached news")

            displayNews(JSON.parse(localStorage.getItem("news_cache")))
          } else {
            // console.log("client is offline")

            document.getElementById("newslist").innerHTML = "<p class='error-msg error--offline'>You are offline.</p>"
          }
        }
      }

      /* facebook */
      if (showFBNotif) {
        addToSidebar("fb-notif", "")
        document.querySelector("aside [data-target='fb-notif']").addEventListener("click", function() {
          chrome.windows.create({
            url: "https://m.facebook.com/notifications",
            width: 350,
            height: 500,
            focused: true,
            type: "panel"
          })
        })
      }

      if (showFB) {
        addToSidebar("fb-msg", "")
        document.querySelector("aside [data-target='fb-msg']").addEventListener("click", function() {
          chrome.windows.create({
            url: "https://m.facebook.com/messages",
            width: 350,
            height: 500,
            focused: true,
            type: "panel"
          })
        })
      }

      /* init navigation */
      var sidebarNavElems = document.querySelectorAll("#sidebar nav a")

      ;[].slice.call(sidebarNavElems).forEach(function(sidebarNavElem, i) {
        if (i === 0) {
          changeSidebarSection(sidebarNavElem.dataset.target)
        }
        sidebarNavElem.addEventListener("click", function() {
          changeSidebarSection(this.dataset.target)
        })
      })
    }

    function toggleSidebar(direction) {
      if (sidebarEnabled !== false) {
        if (direction === null || typeof direction === "undefined") {
          if (document.body.classList.contains("sidebar-opened")) {
            direction = 0
          } else {
            direction = 1
          }
        }

        var methods = ["remove", "add"]
        var method = methods[direction]

        document.body.classList[method]("sidebar-opened")

        if (direction === 1 && sidebarFirstTime) {
          sidebarOnFirstOpen()
        }

        if (direction === 1) sidebarFirstTime = false
      }
    }

    function addToSidebar(id, content) {
      /* make nav elem */
      var navElem = document.createElement("a")
      navElem.dataset.target = id
      sidebar.getElementsByTagName("nav")[0].appendChild(navElem)

      /* make section elem */
      var sectionElem = document.createElement("section")
      sectionElem.innerHTML = content
      sectionElem.dataset.id = id
      sidebar.appendChild(sectionElem)
    }

    document.getElementById("sidebar-btn").addEventListener("click", function() {
      toggleSidebar()
    })
    if (sidebarEnabled === false) {
      document.getElementById("sidebar-btn").style.display = "none"
    }

    if (noAnimation) {
      document.body.classList.add("noanimation")
    }

    (function() {
      var image = document.createElement("img")

      var bgURL = window.backgroundURL.substring(4, backgroundURL.lastIndexOf(")"))
      if (bgURL[0] === "\"" && bgURL[bgURL.length - 1] === "\"") {
        bgURL = bgURL.substring(1, bgURL.length - 1) // remove quotes if present
      }

      image.src = bgURL
      image.onload = function() { // if we do this before the background is loaded user will see a flash of black
        document.body.style.backgroundColor = "black"
      }
    })()

    /* sidebar navigation */

    function changeSidebarSection(id) {
      var targetSection = sidebar.querySelector("section[data-id='" + id + "']")
      var targetLink = sidebar.querySelector("nav [data-target='" + id + "']")
      var sections = sidebar.querySelectorAll("section[data-id]")
      var links = sidebar.querySelectorAll("nav [data-target]")

      for (let i = 0, l = sections.length; i < l; i++) {
        sections[i].classList.remove("current")
        links[i].classList.remove("current")
      }

      targetSection.classList.add("current")
      targetLink.classList.add("current")
    }

    /* open sidebar when mouse on right edge */
    window.addEventListener("mousemove", function(e) {
      clearInterval(sidebarMouseInterval)
      if (Math.abs(e.clientX - window.innerWidth) <= 5) {
        sidebarMouseTime = 0
        sidebarMouseInterval = setInterval(function() {
          sidebarMouseTime += 1
          if (sidebarMouseTime >= 50) {
            toggleSidebar(1)
          }
        })
      }
    })

    bgElem.addEventListener("click", function() {
      toggleSidebar(0)
    })
  }

  if (navigator.userAgent.indexOf("Macintosh") === -1) {
    document.body.classList.add("customscrollbars")
  }

  /* check for and display update messages from server */
  xhr("http://php-nntp.193b.starter-ca-central-1.openshiftapps.com/update-msg/latest.json", function(response) {
    if (response) {
      response = JSON.parse(response)
      var lastDismissedTime = parseInt(localStorage.getItem("update_msg_last_dismissed_time"))
      var msgMaxVer = response.max_version ? response.max_version.split(".").map(v => Number(v)) : [Infinity, Infinity, Infinity]
      var currentVer = chrome.runtime.getManifest().version.split(".").map(v => Number(v))
      if (
        lastDismissedTime && lastDismissedTime > response.time ||
        currentVer[0] > msgMaxVer[0] ||
        currentVer[0] === msgMaxVer[0] && currentVer[1] > msgMaxVer[1] ||
        currentVer[0] === msgMaxVer[0] && currentVer[1] === msgMaxVer[1] && currentVer[2] > msgMaxVer[2]
      ) {
        // don't display update message
      } else {
        // display update message
        var messageElem = document.createElement("div")
        messageElem.classList.add("update-msg")
        messageElem.classList.add(`update-msg--${response.type}`)
        messageElem.innerHTML = `<p>${response.title}<a href="http://php-nntp.193b.starter-ca-central-1.openshiftapps.com/update-msg/latest.html" target="_blank">Read</a></p>`
        messageElem.querySelector("p a").addEventListener("click", function() {
          localStorage.setItem("update_msg_last_dismissed_time", new Date().getTime().toString())
          messageElem.classList.add("hidden")
        })
        document.body.appendChild(messageElem)
      }
    }
  })

  // eslint-disable-next-line no-console
  console.log("\n\
8b  8                     8b  8                     88888      8       888b.                 \n\
8Ybm8 .d88b Yb  db  dP    8Ybm8 .d88b Yb  db  dP      8   .d88 88b.    8  .8 .d88 .d88 .d88b \n\
8  \"8 8.dP'  YbdPYbdP     8  \"8 8.dP'  YbdPYbdP       8   8  8 8  8    8wwP' 8  8 8  8 8.dP' \n\
8   8 `Y88P   YP  YP      8   8 `Y88P   YP  YP        8   `Y88 88P'    8     `Y88 `Y88 `Y88P \n\
                                                                                  wwdP       \n\
\nMIT License\n\
Copyright (c) 2013-2019 Zack Guard\n\n")
})
