import '@awesome.me/webawesome/dist/components/number-input/number-input.js'
import '@awesome.me/webawesome/dist/components/option/option.js'
import '@awesome.me/webawesome/dist/components/select/select.js'
import '@awesome.me/webawesome/dist/components/icon/icon.js'
import '../src/index.js'

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
const STORAGE_KEY = 'lgs1920-countdown-demo-config'

const playground = document.querySelector('#playground-countdown')
const themeControl = document.querySelector('#theme-control')
const modeControl = document.querySelector('#mode-control')
const colorControl = document.querySelector('#color-control')
const appearanceControl = document.querySelector('#appearance-control')
const animationControl = document.querySelector('#animation-control')
const localeControl = document.querySelector('#locale-control')
const ratioControl = document.querySelector('#ratio-control')

const readStoredConfig = () => {
    try {
        const storedConfig = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')

        return {
            theme: THEME_CONFIG[storedConfig.theme] ? storedConfig.theme : themeControl.value,
            mode: ['light', 'dark'].includes(storedConfig.mode) ? storedConfig.mode : modeControl.value,
            color: ['blue', 'red', 'orange', 'green', 'cyan', 'purple', 'pink'].includes(storedConfig.color) ? storedConfig.color : colorControl.value,
            appearance: ['filled', 'outlined', 'filled-outlined'].includes(storedConfig.appearance) ? storedConfig.appearance : appearanceControl.value,
            animation: ['flip', 'fade'].includes(storedConfig.animation) ? storedConfig.animation : animationControl.value,
            locale: ['en', 'fr'].includes(storedConfig.locale) ? storedConfig.locale : localeControl.value,
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
            ratio: ratioControl.value,
        }))
    } catch {
        // Persistence can be unavailable in private or restricted browsing modes.
    }
}

const storedConfig = readStoredConfig()
themeControl.value = storedConfig.theme
modeControl.value = storedConfig.mode
colorControl.value = storedConfig.color
appearanceControl.value = storedConfig.appearance
animationControl.value = storedConfig.animation
localeControl.value = storedConfig.locale
ratioControl.value = storedConfig.ratio

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
 * Applies the interactive playground controls to the main countdown immediately.
 */
const applyPlaygroundControls = () => {
    const ratio = Number(ratioControl.value)

    playground.setAttribute('appearance', appearanceControl.value)
    playground.setAttribute('animation', animationControl.value)
    playground.setAttribute('lang', localeControl.value)

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
})
applyTheme(themeControl.value)
applyColorMode(modeControl.value)
applyBrandColor(colorControl.value)
applyPlaygroundControls()
themeControl.addEventListener('change', () => {
    applyTheme(themeControl.value)
    saveConfig()
})
modeControl.addEventListener('change', () => {
    applyColorMode(modeControl.value)
    saveConfig()
})
colorControl.addEventListener('change', () => {
    applyBrandColor(colorControl.value)
    saveConfig()
})
appearanceControl.addEventListener('change', applyPlaygroundControls)
animationControl.addEventListener('change', applyPlaygroundControls)
localeControl.addEventListener('change', applyPlaygroundControls)
ratioControl.addEventListener('change', applyPlaygroundControls)
ratioControl.addEventListener('input', applyPlaygroundControls)
