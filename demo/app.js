/*******************************************************************************
 *
 * This file is part of the LGS1920/countdown project.
 *
 * File: app.js
 *
 * Author : LGS1920 Team
 * email: studio@lgs1920.fr
 *
 * Created on: 2026-09-04
 * Last modified: 2026-09-04
 *
 *
 * Copyright © 2026 LGS1920
 ******************************************************************************/

import '@awesome.me/webawesome/dist/components/number-input/number-input.js'
import '@awesome.me/webawesome/dist/components/option/option.js'
import '@awesome.me/webawesome/dist/components/copy-button/copy-button.js'
import '@awesome.me/webawesome/dist/components/select/select.js'
import '@awesome.me/webawesome/dist/components/switch/switch.js'
import '@awesome.me/webawesome/dist/components/icon/icon.js'
import '@awesome.me/webawesome/dist/components/breadcrumb/breadcrumb.js'
import '@awesome.me/webawesome/dist/components/breadcrumb-item/breadcrumb-item.js'
import '../src/index.js'
import {highlightCode} from './syntax.js'

const LEGENDS = {
    en: {days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds'},
    fr: {days: 'Jours', hours: 'Heures', minutes: 'Minutes', seconds: 'Secondes'},
    es: {days: 'Días', hours: 'Horas', minutes: 'Minutos', seconds: 'Segundos'},
    de: {days: 'Tage', hours: 'Stunden', minutes: 'Minuten', seconds: 'Sekunden'},
    no: {days: 'Dager', hours: 'Timer', minutes: 'Minutter', seconds: 'Sekunder'},
}

const THEME_CONFIG = {
    default: {
        theme: 'wa-theme-default',
        palette: 'wa-palette-default',
    },
    awesome: {
        theme: 'wa-theme-awesome',
        palette: 'wa-palette-bright',
    },
    shoelace: {
        theme: 'wa-theme-shoelace',
        palette: 'wa-palette-shoelace',
    },
}

const THEME_CLASSES = Object.values(THEME_CONFIG).flatMap(({theme, palette}) => [theme, palette])
const MODE_CLASSES = ['wa-light', 'wa-dark']
const FADE_ONLY_APPEARANCES = ['outlined', 'plain']
const LANGUAGE_CODES = ['en', 'fr', 'es', 'de', 'no']
const STORAGE_KEY = 'lgs1920-countdown-demo-config'

const playground = document.querySelector('#playground-countdown')
const bannerThemeControl = document.querySelector('#banner-theme-control')
const bannerModeControl = document.querySelector('#banner-mode-control')
const bannerColorControl = document.querySelector('#banner-color-control')
const themeControl = document.querySelector('#theme-control')
const modeControl = document.querySelector('#mode-control')
const colorControl = document.querySelector('#color-control')
const appearanceControl = document.querySelector('#appearance-control')
const animationControl = document.querySelector('#animation-control')
const localeControl = document.querySelector('#locale-control')
const legendControl = document.querySelector('#legend-control')
const showAllDigitsControl = document.querySelector('#show-all-digits-control')
const noSecondsControl = document.querySelector('#no-seconds-control')
const ratioControl = document.querySelector('#ratio-control')

const syncBannerControls = () => {
    bannerThemeControl.value = themeControl.value
    bannerModeControl.value = modeControl.value
    bannerColorControl.value = colorControl.value
}

const readStoredConfig = () => {
    try {
        const storedConfig = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')

        return {
            theme: THEME_CONFIG[storedConfig.theme] ? storedConfig.theme : themeControl.value,
            mode: ['light', 'dark'].includes(storedConfig.mode) ? storedConfig.mode : modeControl.value,
            color: ['blue', 'red', 'orange', 'green', 'cyan', 'purple', 'pink'].includes(storedConfig.color) ? storedConfig.color : colorControl.value,
            appearance: ['filled', 'outlined', 'filled-outlined', 'plain'].includes(storedConfig.appearance) ? storedConfig.appearance : appearanceControl.value,
            animation: ['flip', 'fade'].includes(storedConfig.animation) ? storedConfig.animation : animationControl.value,
            locale: LANGUAGE_CODES.includes(storedConfig.locale) ? storedConfig.locale : localeControl.value,
            legend: typeof storedConfig.legend === 'boolean' ? storedConfig.legend : legendControl.checked,
            showAllDigits: typeof storedConfig.showAllDigits === 'boolean' ? storedConfig.showAllDigits : showAllDigitsControl.checked,
            noSeconds: typeof storedConfig.noSeconds === 'boolean' ? storedConfig.noSeconds : noSecondsControl.checked,
            ratio: typeof storedConfig.ratio === 'string' ? storedConfig.ratio : ratioControl.value,
        }
    } catch {
        return {
            theme: themeControl.value,
            mode: modeControl.value,
            color: colorControl.value,
            appearance: appearanceControl.value,
            animation: animationControl.value,
            locale: localeControl.value,
            legend: legendControl.checked,
            showAllDigits: showAllDigitsControl.checked,
            noSeconds: noSecondsControl.checked,
            ratio: ratioControl.value,
        }
    }
}

const saveConfig = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            theme: themeControl.value,
            mode: modeControl.value,
            color: colorControl.value,
            appearance: appearanceControl.value,
            animation: animationControl.value,
        locale: localeControl.value,
        legend: legendControl.checked,
        showAllDigits: showAllDigitsControl.checked,
        noSeconds: noSecondsControl.checked,
        ratio: ratioControl.value,
        }))
    } catch {
    }
}

const storedConfig = readStoredConfig()
themeControl.value = storedConfig.theme
modeControl.value = storedConfig.mode
colorControl.value = storedConfig.color
appearanceControl.value = storedConfig.appearance
animationControl.value = storedConfig.animation
localeControl.value = storedConfig.locale
legendControl.checked = storedConfig.legend
showAllDigitsControl.checked = storedConfig.showAllDigits
noSecondsControl.checked = storedConfig.noSeconds
ratioControl.value = storedConfig.ratio
syncBannerControls()

/**
 * Applies a Web Awesome theme and its matching free palette to the document.
 *
 * @param {string} themeName - Theme selected by the user.
 */
const applyTheme = (themeName) => {
    const selectedTheme = THEME_CONFIG[themeName] ?? THEME_CONFIG.default

    document.documentElement.classList.remove(...THEME_CLASSES)
    document.documentElement.classList.add(selectedTheme.theme, selectedTheme.palette)
}

/**
 * Applies the selected Web Awesome color scheme to the document.
 *
 * @param {string} mode - Either light or dark.
 */
const applyColorMode = (mode) => {
    const selectedMode = mode === 'light' ? 'wa-light' : 'wa-dark'

    document.documentElement.classList.remove(...MODE_CLASSES)
    document.documentElement.classList.add(selectedMode)
}

/**
 * Applies a Web Awesome brand color to the document.
 *
 * @param {string} colorName - Brand color selected by the user.
 */
const applyBrandColor = (colorName) => {
    const colorClass = `wa-brand-${colorName}`

    document.documentElement.classList.remove(...Array.from(document.documentElement.classList).filter((className) => className.startsWith('wa-brand-')))
    document.documentElement.classList.add(colorClass)
}

/**
 * Creates an ISO target date relative to the current browser time.
 *
 * @param {number} seconds - Number of seconds from now.
 * @returns {string} ISO 8601 target date.
 */
const getRelativeTarget = (seconds) => new Date(Date.now() + seconds * 1000).toISOString()

/**
 * Adds a relative target to a countdown example.
 *
 * @param {Element} element - Countdown custom element.
 * @param {number} seconds - Number of seconds from now.
 */
const setRelativeTarget = (element, seconds) => {
    element.setAttribute('target-date', getRelativeTarget(seconds))
}

/**
 * Renders a syntax-highlighted public usage example with a Web Awesome copy button.
 *
 * @param {Element} element - Countdown example element.
 */
const renderExampleCode = (element) => {
    const container = element.closest('.example-card')?.querySelector('.example-code')

    if (!container) {
        return
    }

    const attributes = [
        `appearance="${element.getAttribute('appearance')}"`,
        `animation="${element.getAttribute('animation')}"`,
    ]

    if (element.hasAttribute('show-all-digits')) {
        attributes.push('show-all-digits')
    }

    if (element.hasAttribute('no-seconds')) {
        attributes.push('no-seconds')
    }

    attributes.push(`target-date="${element.getAttribute('target-date')}"`)

    const codeText = `<lgs1920-countdown\n${attributes.map((attribute) => `    ${attribute}`).join('\n')}\n></lgs1920-countdown>`
    const code = document.createElement('code')
    code.className = 'language-html'
    code.innerHTML = highlightCode(codeText, 'html')

    const pre = document.createElement('pre')
    pre.append(code)

    const copyButton = document.createElement('wa-copy-button')
    copyButton.setAttribute('value', codeText)
    copyButton.setAttribute('copy-label', 'Copy')
    copyButton.setAttribute('success-label', 'Copied')
    copyButton.setAttribute('error-label', 'Copy failed')
    copyButton.setAttribute('tooltip', 'full')

    container.replaceChildren(pre, copyButton)
}

/**
 * Applies the interactive playground controls to the main countdown immediately.
 */
const applyPlaygroundControls = () => {
    const ratio = Number(ratioControl.value)
    const appearance = appearanceControl.value
    const animation = FADE_ONLY_APPEARANCES.includes(appearance) ? 'fade' : animationControl.value

    playground.setAttribute('appearance', appearance)
    playground.setAttribute('animation', animation)
    playground.showAllDigits = showAllDigitsControl.checked
    playground.noSeconds = noSecondsControl.checked
    playground.legend = legendControl.checked ? LEGENDS[localeControl.value] ?? LEGENDS.en : false
    animationControl.value = animation

    if (Number.isFinite(ratio) && ratio > 0) {
        playground.setAttribute('ratio', String(ratio))
    } else {
        playground.removeAttribute('ratio')
    }

    setRelativeTarget(playground, 172800)
    saveConfig()
}

setRelativeTarget(playground, 172800)
document.querySelectorAll('.example-countdown').forEach((element) => {
    setRelativeTarget(element, Number(element.dataset.duration))
    element.legend = LEGENDS[element.dataset.language] ?? LEGENDS.en
    renderExampleCode(element)
})
applyTheme(themeControl.value)
applyColorMode(modeControl.value)
applyBrandColor(colorControl.value)
applyPlaygroundControls()
themeControl.addEventListener('change', () => {
    applyTheme(themeControl.value)
    bannerThemeControl.value = themeControl.value
    saveConfig()
})
modeControl.addEventListener('change', () => {
    applyColorMode(modeControl.value)
    bannerModeControl.value = modeControl.value
    saveConfig()
})
colorControl.addEventListener('change', () => {
    applyBrandColor(colorControl.value)
    bannerColorControl.value = colorControl.value
    saveConfig()
})
bannerThemeControl.addEventListener('change', () => {
    themeControl.value = bannerThemeControl.value
    applyTheme(themeControl.value)
    saveConfig()
})
bannerModeControl.addEventListener('change', () => {
    modeControl.value = bannerModeControl.value
    applyColorMode(modeControl.value)
    saveConfig()
})
bannerColorControl.addEventListener('change', () => {
    colorControl.value = bannerColorControl.value
    applyBrandColor(colorControl.value)
    saveConfig()
})
appearanceControl.addEventListener('change', applyPlaygroundControls)
animationControl.addEventListener('change', applyPlaygroundControls)
legendControl.addEventListener('input', applyPlaygroundControls)
legendControl.addEventListener('change', applyPlaygroundControls)
localeControl.addEventListener('input', applyPlaygroundControls)
localeControl.addEventListener('change', applyPlaygroundControls)
showAllDigitsControl.addEventListener('input', applyPlaygroundControls)
showAllDigitsControl.addEventListener('change', applyPlaygroundControls)
noSecondsControl.addEventListener('input', applyPlaygroundControls)
noSecondsControl.addEventListener('change', applyPlaygroundControls)
ratioControl.addEventListener('change', applyPlaygroundControls)
ratioControl.addEventListener('input', applyPlaygroundControls)
