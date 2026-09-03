import '@awesome.me/webawesome/dist/components/number-input/number-input.js'
import '@awesome.me/webawesome/dist/components/option/option.js'
import '@awesome.me/webawesome/dist/components/select/select.js'
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

const playground = document.querySelector('#playground-countdown')
const themeControl = document.querySelector('#theme-control')
const modeControl = document.querySelector('#mode-control')
const colorControl = document.querySelector('#color-control')
const appearanceControl = document.querySelector('#appearance-control')
const animationControl = document.querySelector('#animation-control')
const localeControl = document.querySelector('#locale-control')
const ratioControl = document.querySelector('#ratio-control')

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
}

setRelativeTarget(playground, 172800)
document.querySelectorAll('.example-countdown').forEach((element) => {
    setRelativeTarget(element, Number(element.dataset.duration))
})
applyTheme(themeControl.value)
applyColorMode(modeControl.value)
applyBrandColor(colorControl.value)
themeControl.addEventListener('change', () => applyTheme(themeControl.value))
modeControl.addEventListener('change', () => applyColorMode(modeControl.value))
colorControl.addEventListener('change', () => applyBrandColor(colorControl.value))
appearanceControl.addEventListener('change', applyPlaygroundControls)
animationControl.addEventListener('change', applyPlaygroundControls)
localeControl.addEventListener('change', applyPlaygroundControls)
ratioControl.addEventListener('change', applyPlaygroundControls)
ratioControl.addEventListener('input', applyPlaygroundControls)
