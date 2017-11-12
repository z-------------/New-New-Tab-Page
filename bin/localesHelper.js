#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const PROJECT_ROOT = path.join(__dirname, "..")
const manifest = require(path.join(PROJECT_ROOT, "manifest.json"))
const LOCALES_DIR = path.join(PROJECT_ROOT, "_locales")

var locale, defaultLocale, currentLocale
var keysToAdd = []

fs.readdir(LOCALES_DIR, (err, existingLocales) => {
  console.log(`\nDefault locale:   ${manifest.default_locale}`)
  console.log(`Existing locales: ${existingLocales.join(", ")}`)
  rl.question("\nWork on {e}xisting locale, or start a {n}ew one? ", (mode) => {
    if (mode === "e" || mode === "n") {
      rl.question("\nLocale code? ", (chosenLocale) => {
        if (mode === "n") {
          fs.mkdir(path.join(LOCALES_DIR, chosenLocale), (err) => {
            if (err) throw err
            fs.writeFile(path.join(LOCALES_DIR, chosenLocale, "messages.json"), "{}", (err) => {
              if (err) throw err
              startEditing(chosenLocale)
            })
          })
        }
        if (mode === "e") {
          startEditing(chosenLocale)
        }
      })
    } else {
      console.log("\nError: mode must be 'e' or 'n'")
      process.exit(1)
    }
  })
})

let startEditing = function(chosenLocale) {
  locale = chosenLocale
  console.log(`\nWorking on locale ${locale}.`)

  defaultLocale = require(path.join(LOCALES_DIR, manifest.default_locale, "messages.json"))
  let defaultLocaleKeys = Object.keys(defaultLocale)

  fs.readFile(path.join(LOCALES_DIR, locale, "messages.json"), (err, data) => {
    if (err) throw err

    currentLocale = JSON.parse(data)

    for (let i = 0, l = defaultLocaleKeys.length; i < l; i++) {
      if (!currentLocale.hasOwnProperty(defaultLocaleKeys[i])) {
        keysToAdd.push(defaultLocaleKeys[i])
      }
    }

    next(keysToAdd[0])
  })
}

let next = function(key) {
  let defaultMessage = defaultLocale[key].message
  let description = defaultLocale[key].description
  console.log(`\nName: ${key}${description ? `\nDescription: ${description}` : ""}\nMessage in ${manifest.default_locale}: ${defaultMessage}`)
  rl.question(`Translation for ${locale}: `, (newTranslation) => {
    if (newTranslation.length > 0) {
      var newMessageData = { message: newTranslation }
      if (description) newMessageData.description = description
      currentLocale[key] = newMessageData
      fs.writeFile(path.join(LOCALES_DIR, locale, "messages.json"), JSON.stringify(currentLocale, null, 2), (err) => {
        if (err) throw err
        next(keysToAdd[keysToAdd.indexOf(key) + 1])
      })
    } else {
      console.log("Skipped. Moving on...")
      next(keysToAdd.indexOf(key) + 1)
    }
  })
}
