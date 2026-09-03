const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000
const MAX_COUNTDOWN_DAYS = 999
const MAX_COUNTDOWN_MILLISECONDS = MAX_COUNTDOWN_DAYS * DAY_IN_MILLISECONDS
const COUNTDOWN_FLIP_DURATION = 650
const COUNTDOWN_FADE_DURATION = COUNTDOWN_FLIP_DURATION
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2
const COUNTDOWN_APPEARANCES = ['filled', 'outlined', 'filled-outlined']
const COUNTDOWN_ANIMATIONS = ['flip', 'fade']

const COUNTDOWN_UNITS = [
    {key: 'days', width: 3},
    {key: 'hours', width: 2},
    {key: 'minutes', width: 2},
    {key: 'seconds', width: 2},
]

const COUNTDOWN_COPY = {
    en: {
        labels: {
            days:    'Days',
            hours:   'Hours',
            minutes: 'Minutes',
            seconds: 'Seconds',
        },
        invalid:  'This countdown cannot be displayed.',
        tooFar:   'The target date must be within 999 days.',
    },
    fr: {
        labels: {
            days:    'Jours',
            hours:   'Heures',
            minutes: 'Minutes',
            seconds: 'Secondes',
        },
        invalid:  'Ce compte à rebours ne peut pas être affiché.',
        tooFar:   'La date cible doit être située dans les 999 prochains jours.',
    },
}

const COUNTDOWN_STYLES = `
    :host {
        --lgs-countdown-height-width-ratio: 1.618033988749895;
        --lgs-countdown-unit-gap: var(--wa-space-xs, 0.5rem);
        --lgs-countdown-digit-gap: var(--wa-space-3xs, 2px);
        --lgs-countdown-card-width: clamp(1rem, calc((100cqi - 3 * var(--lgs-countdown-unit-gap) - 5 * var(--lgs-countdown-digit-gap)) / 9), 5.8rem);
        --lgs-countdown-card-surface: color-mix(in oklab, var(--wa-color-brand-fill-quiet, var(--wa-color-neutral-fill-quiet)) 72%, var(--wa-color-neutral-10) 28%);
        --lgs-countdown-card-border: var(--wa-color-neutral-border-normal, var(--wa-color-surface-border));
        --lgs-countdown-card-radius: var(--wa-panel-border-radius, var(--wa-border-radius-m, 0.375rem));
        --lgs-countdown-brand-color: var(--wa-color-brand, var(--wa-color-text-normal));
        --lgs-countdown-legend-color: var(--wa-color-text-normal);
        display: block;
        container-type: inline-size;
        color: var(--lgs-countdown-brand-color);
        font-family: var(--wa-font-family-heading, sans-serif);
    }

    .countdown {
        display: grid;
        gap: var(--wa-space-s, 0.75rem);
        min-inline-size: 0;
    }

    .countdown-units {
        display: grid;
        grid-template-columns: repeat(4, max-content);
        gap: var(--lgs-countdown-unit-gap);
        justify-content: space-between;
        min-inline-size: 0;
    }

    .countdown-unit {
        display: grid;
        justify-items: center;
        gap: var(--wa-space-xs, 0.5rem);
        min-inline-size: 0;
        text-align: center;
    }

    .countdown-digits {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        gap: var(--lgs-countdown-digit-gap);
        min-inline-size: 0;
    }

    wa-animation {
        display: block;
        flex: 0 0 var(--lgs-countdown-card-width);
        inline-size: var(--lgs-countdown-card-width);
        min-inline-size: 0;
    }

    wa-card.countdown-digit-card {
        --spacing: 0;
        --wa-panel-border-radius: var(--lgs-countdown-card-radius);
        --lgs-countdown-rotor-surface: var(--lgs-countdown-card-surface);
        display: block;
        inline-size: 100%;
        min-inline-size: 0;
        margin: 0;
        aspect-ratio: 1 / var(--lgs-countdown-height-width-ratio);
        overflow: hidden;
        border-radius: var(--lgs-countdown-card-radius);
        color: var(--lgs-countdown-brand-color);
    }

    wa-card.countdown-digit-card[appearance='filled'],
    wa-card.countdown-digit-card[appearance='filled-outlined'] {
        background-color: var(--lgs-countdown-card-surface);
    }

    wa-card.countdown-digit-card[appearance='outlined'] {
        --lgs-countdown-rotor-surface: transparent;
        background-color: transparent;
    }

    wa-card.countdown-digit-card[appearance='outlined'],
    wa-card.countdown-digit-card[appearance='filled-outlined'] {
        border: var(--wa-panel-border-width) var(--wa-panel-border-style) var(--lgs-countdown-card-border);
    }

    wa-card.countdown-digit-card[appearance='filled'] {
        border: 0;
    }

    .countdown-animation[data-countdown-animation='fade'] .rotor-leaf {
        display: none;
    }

    wa-card.countdown-digit-card::part(body) {
        display: block;
        block-size: 100%;
        box-sizing: border-box;
        padding: 0;
        overflow: hidden;
        border-radius: inherit;
    }

    .rotor {
        position: relative;
        display: block;
        block-size: 100%;
        inline-size: 100%;
        padding: 0;
        overflow: visible;
        perspective: 150px;
        transform-style: preserve-3d;
        font-size: calc(var(--lgs-countdown-card-width) * var(--lgs-countdown-height-width-ratio) * 0.9);
        font-family: var(--wa-font-family-heading, sans-serif);
        font-variant-numeric: tabular-nums;
        font-weight: 750;
        line-height: 1;
        background: var(--lgs-countdown-rotor-surface);
        opacity: 1;
        transition: opacity ${COUNTDOWN_FADE_DURATION / 2}ms ease-in-out;
    }

    /* Hide the fractional raster seam between the two clipped rotor planes. */
    .rotor::after {
        position: absolute;
        inset-inline: 0;
        inset-block-start: calc(50% - 0.5px);
        block-size: 1px;
        z-index: 3;
        content: '';
        pointer-events: none;
        background: var(--lgs-countdown-rotor-surface);
    }

    .rotor.is-fading-out {
        opacity: 0;
    }

    .rotor-top,
    .rotor-bottom {
        position: absolute;
        inset-inline: 0;
        block-size: 50%;
        padding: var(--wa-space-xs, 0.5rem);
        box-sizing: border-box;
        overflow: hidden;
        border: 0;
        background: var(--lgs-countdown-rotor-surface);
    }

    .rotor-face-value {
        position: absolute;
        inset-inline: 0;
        display: grid;
        place-items: center;
        block-size: 200%;
        font: inherit;
        line-height: 1;
    }

    .rotor-top {
        inset-block-start: 0;
        color: inherit;
    }

    .rotor-top .rotor-face-value {
        inset-block-start: 0;
    }

    .rotor-bottom {
        inset-block-end: 0;
        color: inherit;
    }

    .rotor-bottom .rotor-face-value {
        inset-block-end: 0;
    }

    .rotor-leaf {
        position: absolute;
        inset-inline: 0;
        inset-block-start: 0;
        inset-block-end: auto;
        block-size: 50%;
        z-index: 1;
        transform-origin: 50% 100%;
        transform-style: preserve-3d;
        transition: transform 0s;
        will-change: transform;
    }

    .rotor-leaf.flipped {
        transform: rotateX(-180deg);
        transition: transform 0.65s ease-in-out;
    }

    .rotor-leaf-front,
    .rotor-leaf-rear {
        position: absolute;
        inset-inline: 0;
        inset-block-start: 0;
        inset-block-end: auto;
        block-size: 100%;
        padding: var(--wa-space-xs, 0.5rem);
        overflow: hidden;
        margin: 0;
        z-index: 1;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        box-sizing: border-box;
        border: 0;
        background: var(--lgs-countdown-rotor-surface);
    }

    .rotor-leaf-front {
        transform: rotateX(0deg);
        color: inherit;
        border-radius: var(--lgs-countdown-card-radius) var(--lgs-countdown-card-radius) 0 0;
    }

    .rotor-leaf-front .rotor-face-value {
        inset-block-start: 0;
    }

    .rotor-leaf-rear {
        transform: rotateX(180deg);
        color: inherit;
        border-radius: 0 0 var(--lgs-countdown-card-radius) var(--lgs-countdown-card-radius);
    }

    .rotor-leaf-rear .rotor-face-value {
        inset-block-end: 0;
    }

    .rotor-hinge {
        display: none;
        inset-inline: 0;
        position: absolute;
        inset-block-start: 50%;
        z-index: 4;
        block-size: 2px;
        content: '';
        pointer-events: none;
        transform: translateY(-50%);
        background: color-mix(in oklab, var(--lgs-countdown-brand-color) 48%, var(--wa-color-neutral-10) 52%);
    }

    .countdown-label {
        color: var(--lgs-countdown-legend-color);
        font-family: var(--wa-font-family-heading, sans-serif);
        font-size: var(--wa-font-size-s, 0.875rem);
        font-weight: 650;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .countdown-sr-only {
        position: absolute;
        inline-size: 1px;
        block-size: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        white-space: nowrap;
    }

    wa-callout::part(base) {
        margin: 0;
    }

    @container (max-width: 22rem) {
        .countdown-label {
            font-size: var(--wa-font-size-2xs, 0.6875rem);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        wa-animation {
            animation: none;
        }
    }
`

/**
 * Determines whether a value is a valid JavaScript Date instance.
 *
 * @param {unknown} value - Value to inspect.
 * @returns {boolean} Whether the value represents a valid date.
 */
export const isValidDate = (value) => value instanceof Date && Number.isFinite(value.getTime())

/**
 * Calculates the visible countdown units for two dates.
 *
 * @param {Date} targetDate - Date at which the countdown expires.
 * @param {Date} now - Current reference date.
 * @returns {{totalSeconds: number, days: number, hours: number, minutes: number, seconds: number}} Remaining units.
 */
export const getCountdownParts = (targetDate, now = new Date()) => {
    if (!isValidDate(targetDate) || !isValidDate(now)) {
        return {totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0}
    }

    const remainingMilliseconds = Math.max(0, targetDate.getTime() - now.getTime())
    const totalSeconds = Math.ceil(remainingMilliseconds / 1000)
    const days = Math.floor(totalSeconds / (24 * 60 * 60))
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
    const seconds = totalSeconds % 60

    return {totalSeconds, days, hours, minutes, seconds}
}

/**
 * Parses and validates a countdown target date.
 *
 * @param {string|null|undefined} targetValue - ISO 8601 target date from the component attribute.
 * @param {Date} now - Current reference date.
 * @returns {{status: string, targetDate?: Date, parts?: object}} Validation state and remaining units.
 */
export const getCountdownState = (targetValue, now = new Date()) => {
    if (typeof targetValue !== 'string' || targetValue.trim() === '') {
        return {status: 'missing'}
    }

    const targetTimestamp = Date.parse(targetValue)
    if (!Number.isFinite(targetTimestamp) || !isValidDate(now)) {
        return {status: 'invalid'}
    }

    const targetDate = new Date(targetTimestamp)
    const remainingMilliseconds = targetTimestamp - now.getTime()
    if (remainingMilliseconds > MAX_COUNTDOWN_MILLISECONDS) {
        return {status: 'too-far', targetDate}
    }

    return {
        status: remainingMilliseconds <= 0 ? 'expired' : 'ready',
        targetDate,
        parts: getCountdownParts(targetDate, now),
    }
}

/**
 * Formats a unit value with the required minimum width.
 *
 * @param {number} value - Numeric unit value.
 * @param {number} width - Minimum number of digits.
 * @returns {string} Formatted numeric value.
 */
const formatUnitValue = (value, width) => String(value).padStart(width, '0')

/**
 * Parses the public height-to-width ratio and falls back to the golden ratio.
 *
 * @param {unknown} value - Ratio value from the component attribute.
 * @returns {number} Valid positive height-to-width ratio.
 */
export const getCountdownRatio = (value) => {
    const ratio = Number(value)

    return Number.isFinite(ratio) && ratio > 0 ? ratio : GOLDEN_RATIO
}

/**
 * Resolves the Web Awesome card appearance used by the countdown digits.
 *
 * @param {unknown} value - Appearance value from the component attribute.
 * @returns {'filled'|'outlined'|'filled-outlined'} Supported card appearance.
 */
export function getCountdownAppearance(value) {
    return COUNTDOWN_APPEARANCES.includes(value) ? value : 'filled-outlined'
}

/**
 * Resolves the digit transition while enforcing the outlined-card restriction.
 *
 * @param {unknown} value - Animation value from the component attribute.
 * @param {unknown} appearance - Resolved card appearance.
 * @returns {'flip'|'fade'} Supported digit transition.
 */
export function getCountdownAnimation(value, appearance) {
    const animation = COUNTDOWN_ANIMATIONS.includes(value) ? value : 'flip'

    return appearance === 'outlined' ? 'fade' : animation
}

/**
 * Builds the four visible countdown values.
 *
 * @param {{days: number, hours: number, minutes: number, seconds: number}} parts - Countdown parts.
 * @returns {Record<string, string>} Values keyed by countdown unit.
 */
const getUnitDisplayValues = (parts) => Object.fromEntries(COUNTDOWN_UNITS.map(({key, width}) => [
    key,
    formatUnitValue(parts[key], key === 'days' ? Math.min(3, Math.max(1, String(parts[key]).length)) : width),
]))

/**
 * Resolves the component locale from its explicit or inherited language.
 *
 * @param {HTMLElement} element - Countdown element.
 * @returns {'en'|'fr'} Supported component locale.
 */
const getLocale = (element) => {
    const explicitLocale = element.getAttribute('lang')
    const inheritedLocale = element.closest?.('[lang]')?.getAttribute('lang')
    const documentLocale = typeof document === 'undefined' ? '' : document.documentElement.lang
    const locale = explicitLocale || inheritedLocale || documentLocale || 'en'

    return locale.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

/**
 * Escapes static label text before inserting it into the component shadow tree.
 *
 * @param {string} value - Text to escape.
 * @returns {string} Safe HTML text.
 */
const escapeHtml = (value) => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

/**
 * Creates the Web Awesome markup for one digit card.
 *
 * @param {string} value - Initial digit value.
 * @param {number} index - Digit index within its unit.
 * @param {'filled'|'outlined'|'filled-outlined'} appearance - Web Awesome card appearance.
 * @param {'flip'|'fade'} animation - Digit transition.
 * @returns {string} Digit card markup.
 */
const createDigitMarkup = (value, index, appearance, animation) => `
    <wa-animation class="countdown-animation" data-countdown-animation="${animation}" name="${animation}" duration="${COUNTDOWN_FLIP_DURATION}" easing="ease-in-out">
        <wa-card class="countdown-digit-card" appearance="${appearance}">
            <span class="rotor" data-digit-index="${index}">
                <span class="rotor-leaf">
                    <span class="rotor-leaf-rear"><span class="rotor-face-value" data-face="rear">${value}</span></span>
                    <span class="rotor-leaf-front"><span class="rotor-face-value" data-face="front">${value}</span></span>
                </span>
                <span class="rotor-top"><span class="rotor-face-value" data-face="top">${value}</span></span>
                <span class="rotor-bottom"><span class="rotor-face-value" data-face="bottom">${value}</span></span>
                <span class="rotor-hinge" aria-hidden="true"></span>
            </span>
        </wa-card>
    </wa-animation>
`

/**
 * Creates the initial countdown layout using Web Awesome cards and animation elements.
 *
 * @param {{days: number, hours: number, minutes: number, seconds: number}} parts - Countdown parts.
 * @param {'en'|'fr'} locale - Component locale.
 * @param {'filled'|'outlined'|'filled-outlined'} appearance - Web Awesome card appearance.
 * @param {'flip'|'fade'} animation - Digit transition.
 * @returns {string} Countdown shadow DOM markup.
 */
const createCountdownMarkup = (parts, locale, appearance, animation) => {
    const copy = COUNTDOWN_COPY[locale]
    const values = getUnitDisplayValues(parts)
    const accessibleValues = COUNTDOWN_UNITS.map(({key}) => `${copy.labels[key]} ${values[key]}`).join(', ')
    const unitsMarkup = COUNTDOWN_UNITS.map(({key}) => `
        <div class="countdown-unit" data-unit="${key}">
            <div class="countdown-digits" aria-hidden="true">
                ${[...values[key]].map((value, index) => createDigitMarkup(value, index, appearance, animation)).join('')}
            </div>
            <span class="countdown-label">${escapeHtml(copy.labels[key])}</span>
        </div>
    `).join('')

    return `
        <div class="countdown" role="timer" aria-live="off" aria-atomic="true" aria-label="${escapeHtml(accessibleValues)}">
            <div class="countdown-units">
                ${unitsMarkup}
            </div>
            <span class="countdown-sr-only" data-countdown-announcement aria-live="polite">${escapeHtml(accessibleValues)}</span>
        </div>
    `
}

/**
 * Creates the localized Web Awesome error state.
 *
 * @param {'en'|'fr'} locale - Component locale.
 * @param {'missing'|'invalid'|'too-far'} status - Validation status.
 * @returns {string} Error state markup.
 */
const createErrorMarkup = (locale, status) => {
    const copy = COUNTDOWN_COPY[locale]
    const message = status === 'too-far' ? copy.tooFar : copy.invalid

    return `<wa-callout variant="danger" appearance="filled-outlined" role="alert">${escapeHtml(message)}</wa-callout>`
}

/**
 * Returns the accessible announcement for a countdown state.
 *
 * @param {{days: number, hours: number, minutes: number, seconds: number}} parts - Countdown parts.
 * @param {'en'|'fr'} locale - Component locale.
 * @returns {string} Localized accessible countdown text.
 */
const getAccessibleCountdownText = (parts, locale) => {
    const copy = COUNTDOWN_COPY[locale]
    const values = getUnitDisplayValues(parts)

    return COUNTDOWN_UNITS.map(({key}) => `${copy.labels[key]} ${values[key]}`).join(', ')
}

/**
 * Indicates whether decorative digit animation can play.
 *
 * @returns {boolean} Whether reduced motion is not requested.
 */
const shouldAnimate = () => typeof window === 'undefined'
    || typeof window.matchMedia !== 'function'
    || !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const CountdownElementBase = typeof HTMLElement === 'undefined' ? class {} : HTMLElement

/**
 * Displays a localized, branded countdown using Web Awesome components.
 */
export class Lgs1920Countdown extends CountdownElementBase {
    static observedAttributes = ['target-date', 'ratio', 'appearance', 'animation']

    /**
     * Creates the countdown shadow root and initializes its timer state.
     */
    constructor() {
        super()
        this.timerId = null
        this.renderedStatus = null
        this.renderedDigitCount = null
        this.renderedAppearance = null
        this.renderedAnimation = null

        if (typeof this.attachShadow === 'function') {
            this.attachShadow({mode: 'open'})
            const style = document.createElement('style')
            style.textContent = COUNTDOWN_STYLES
            this.shadowRoot.append(style)
        }

        this.applyRatio()
    }

    /**
     * Starts or refreshes the countdown when the element is connected.
     */
    connectedCallback() {
        this.applyRatio()
        this.updateCountdown()
        this.startTimer()
    }

    /**
     * Stops the countdown timer when the element leaves the document.
     */
    disconnectedCallback() {
        this.stopTimer()
    }

    /**
     * Revalidates the target date when the public attribute changes.
     *
     * @param {string} name - Changed attribute name.
     * @param {string|null} oldValue - Previous attribute value.
     * @param {string|null} newValue - New attribute value.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue || !this.isConnected) {
            return
        }

        if (name === 'ratio') {
            this.applyRatio()
            return
        }

        if (name === 'appearance' || name === 'animation') {
            this.updateCountdown()
            return
        }

        if (name !== 'target-date') {
            return
        }

        this.stopTimer()
        this.updateCountdown()
        this.startTimer()
    }

    /**
     * Applies the public height-to-width ratio to the countdown digit cards.
     */
    applyRatio = () => {
        this.style.setProperty('--lgs-countdown-height-width-ratio', String(getCountdownRatio(this.getAttribute('ratio'))))
    }

    /**
     * Stops an existing countdown interval.
     */
    stopTimer = () => {
        if (this.timerId !== null) {
            clearInterval(this.timerId)
            this.timerId = null
        }
    }

    /**
     * Starts the one-second countdown interval when the target is valid and pending.
     */
    startTimer = () => {
        this.stopTimer()
        const state = getCountdownState(this.getAttribute('target-date'))

        if (state.status === 'ready') {
            this.timerId = setInterval(this.updateCountdown, 1000)
        }
    }

    /**
     * Renders the current countdown state and updates changed digit cards.
     */
    updateCountdown = () => {
        if (!this.shadowRoot) {
            return
        }

        const locale = getLocale(this)
        const state = getCountdownState(this.getAttribute('target-date'))
        const digitCount = state.parts ? getUnitDisplayValues(state.parts).days.length : null
        const appearance = getCountdownAppearance(this.getAttribute('appearance'))
        const animation = getCountdownAnimation(this.getAttribute('animation'), appearance)

        if (state.status !== this.renderedStatus || digitCount !== this.renderedDigitCount || appearance !== this.renderedAppearance || animation !== this.renderedAnimation) {
            this.renderedStatus = state.status
            this.renderedDigitCount = digitCount
            this.renderedAppearance = appearance
            this.renderedAnimation = animation

            if (state.parts) {
                this.shadowRoot.innerHTML = `<style>${COUNTDOWN_STYLES}</style>${createCountdownMarkup(state.parts, locale, appearance, animation)}`
            } else {
                this.shadowRoot.innerHTML = `<style>${COUNTDOWN_STYLES}</style>${createErrorMarkup(locale, state.status)}`
            }
        }

        if (state.parts) {
            this.updateDigits(state.parts, locale, appearance, animation)

            if (state.status === 'expired') {
                this.stopTimer()
            }
        }
    }

    /**
     * Updates the numeric halves and accessible label for the current countdown parts.
     *
     * @param {{days: number, hours: number, minutes: number, seconds: number}} parts - Countdown parts.
     * @param {'en'|'fr'} locale - Component locale.
     * @param {'filled'|'outlined'|'filled-outlined'} appearance - Web Awesome card appearance.
     * @param {'flip'|'fade'} animation - Digit transition.
     */
    updateDigits = (parts, locale, appearance, animation) => {
        const values = getUnitDisplayValues(parts)
        const countdown = this.shadowRoot.querySelector('.countdown')
        const previousValues = this.previousValues || {}

        COUNTDOWN_UNITS.forEach(({key}) => {
            const value = values[key]
            const previousValue = previousValues[key]
            const digits = [...value]
            const unit = this.shadowRoot.querySelector(`[data-unit="${key}"]`)

            if (!unit) {
                return
            }

            unit.querySelectorAll('[data-digit-index]').forEach((digit, index) => {
                const nextValue = digits[index]
                if (nextValue === undefined) {
                    return
                }

                const changed = previousValue !== undefined && previousValue[index] !== nextValue
                const front = digit.querySelector('[data-face="front"]')
                const rear = digit.querySelector('[data-face="rear"]')
                const top = digit.querySelector('[data-face="top"]')
                const bottom = digit.querySelector('[data-face="bottom"]')
                const leaf = digit.querySelector('.rotor-leaf')
                const card = digit.closest('wa-card')

                if (!front || !rear || !top || !bottom || !leaf) {
                    return
                }

                if (!changed || !shouldAnimate()) {
                    front.textContent = nextValue
                    rear.textContent = nextValue
                    top.textContent = nextValue
                    bottom.textContent = nextValue
                    digit.classList.remove('is-fading-out')
                    leaf.style.removeProperty('visibility')
                    leaf.classList.remove('flipped')
                    card?.classList.remove('is-flipping')
                    return
                }

                const currentValue = previousValue[index]

                if (animation === 'fade') {
                    digit.classList.remove('is-fading-out')
                    void digit.offsetWidth
                    digit.classList.add('is-fading-out')
                    setTimeout(function () {
                        if (!digit.isConnected) {
                            return
                        }

                        front.textContent = nextValue
                        rear.textContent = nextValue
                        top.textContent = nextValue
                        bottom.textContent = nextValue
                        digit.classList.remove('is-fading-out')
                    }, COUNTDOWN_FADE_DURATION / 2)
                    return
                }

                leaf.style.visibility = 'hidden'
                leaf.classList.remove('flipped')
                front.textContent = currentValue
                rear.textContent = nextValue
                top.textContent = nextValue
                bottom.textContent = currentValue
                void leaf.offsetWidth
                leaf.style.removeProperty('visibility')
                card?.classList.add('is-flipping')
                requestAnimationFrame(function () {
                    leaf.classList.add('flipped')
                })
                setTimeout(function () {
                    card?.classList.remove('is-flipping')
                }, COUNTDOWN_FLIP_DURATION + 40)
            })
        })

        const accessibleText = getAccessibleCountdownText(parts, locale)
        if (countdown) {
            countdown.setAttribute('aria-label', accessibleText)
        }

        const announcement = this.shadowRoot.querySelector('[data-countdown-announcement]')
        if (announcement && this.previousValues) {
            announcement.textContent = accessibleText
        }

        this.previousValues = values
    }
}

if (typeof customElements !== 'undefined' && !customElements.get('lgs1920-countdown')) {
    customElements.define('lgs1920-countdown', Lgs1920Countdown)
}

export {MAX_COUNTDOWN_DAYS}
