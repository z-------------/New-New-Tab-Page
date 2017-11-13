#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const styles = {
  RESET: "\x1b[0m",
  BRIGHT: "\x1b[1m",
  DIM: "\x1b[2m",
  UNDERSCORE: "\x1b[4m",
  BLINK: "\x1b[5m",
  REVERSE: "\x1b[7m",
  HIDDEN: "\x1b[8m"
}

const PROJECT_ROOT = path.join(__dirname, "..")
const manifest = require(path.join(PROJECT_ROOT, "manifest.json"))
const LOCALES_DIR = path.join(PROJECT_ROOT, "_locales")

var locale, currentLocale
var keysToAdd = []
let defaultLocale = require(path.join(LOCALES_DIR, manifest.default_locale, "messages.json"))
let defaultLocaleKeys = Object.keys(defaultLocale)

fs.readdir(LOCALES_DIR, (err, existingLocales) => {
  console.log(`\n${styles.BRIGHT}Default locale${styles.RESET}  : ${manifest.default_locale}`)

  existingLocalesString = existingLocales.map((localeName) => {
    return `${localeName} (${Math.floor(getLocaleProgress(localeName) * 100)}%)`
  })
  console.log(`${styles.BRIGHT}Existing locales${styles.RESET}: ${existingLocalesString.join(", ")}`)

  rl.question(`\n${styles.UNDERSCORE}Work on {e}xisting locale, start a {n}ew one, or {l}ist missing messages?${styles.RESET} `, (mode) => {
    if (mode === "e" || mode === "n" || mode === "l") {
      rl.question(`\n${styles.UNDERSCORE}Locale code?${styles.RESET} `, (chosenLocale) => {
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
        if (mode === "l") {
          let missingKeys = getLocaleProgress(chosenLocale, true)[1]
          console.log(`\n${styles.BRIGHT}Messages missing from locale ${chosenLocale}${styles.RESET}: \n${missingKeys.join(", ")}\n\nThat's all. Exiting.`)
          process.exit(0)
        }
      })
    } else {
      console.log(`\n${styles.BRIGHT}Error${styles.RESET}: mode must be 'e' or 'n'`)
      process.exit(1)
    }
  })
})

let getLocaleProgress = function(localeToCheck, includeMissingKeys) {
  let fileContents = fs.readFileSync(path.join(LOCALES_DIR, localeToCheck, "messages.json"))
  let localeKeys = Object.keys(JSON.parse(fileContents))
  let progress = localeKeys.length / defaultLocaleKeys.length
  if (includeMissingKeys === true) {
    var missingKeys = []
    for (let i = 0, l = defaultLocaleKeys.length; i < l; i++) {
      if (localeKeys.indexOf(defaultLocaleKeys[i]) === -1) {
        missingKeys.push(defaultLocaleKeys[i])
      }
    }
    return [progress, missingKeys]
  } else {
    return progress
  }
}

let startEditing = function(chosenLocale) {
  locale = chosenLocale
  // console.log(`\nWorking on locale ${styles.BRIGHT}${locale}${styles.RESET}.`)

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
  if (key && defaultLocale[key]) {
    let defaultMessage = defaultLocale[key].message
    let description = defaultLocale[key].description
    console.log(`\n┌─${styles.BRIGHT}${key}${styles.RESET}──\n│`)
    if (description) {
      console.log(`│ ${styles.BRIGHT}Description${styles.RESET}: ${description}`)
    }
    console.log(`│ ${styles.BRIGHT}Message in ${manifest.default_locale}${styles.RESET}: ${defaultMessage}`)
    rl.question(`│ ${styles.BRIGHT}${styles.UNDERSCORE}Translation for ${locale}${styles.RESET}: `, (newTranslation) => {
      if (newTranslation.length > 0) {
        var newMessageData = { message: newTranslation }
        if (description) newMessageData.description = description
        currentLocale[key] = newMessageData
        fs.writeFile(path.join(LOCALES_DIR, locale, "messages.json"), JSON.stringify(currentLocale, null, 2) + "\n", (err) => {
          if (err) throw err
          console.log("│\n└────────────────────────")
          next(keysToAdd[keysToAdd.indexOf(key) + 1])
        })
      } else {
        console.log("│\n└─Skipped. Moving on...──")
        next(keysToAdd[keysToAdd.indexOf(key) + 1])
      }
    })
  } else {
    console.log(`\n${styles.BRIGHT}That's all for locale ${locale}${styles.RESET}. Exiting.`)
    process.exit(0)
  }
}
