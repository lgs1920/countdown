/*******************************************************************************
 *
 * This file is part of the LGS1920/countdown project.
 *
 * File: readme.js
 *
 * Author : LGS1920 Team
 * email: studio@lgs1920.fr
 *
 * Created on: 2026-09-05
 * Last modified: 2026-09-05
 *
 *
 * Copyright © 2026 LGS1920
 ******************************************************************************/

import '@awesome.me/webawesome/dist/components/breadcrumb/breadcrumb.js'
import '@awesome.me/webawesome/dist/components/breadcrumb-item/breadcrumb-item.js'
import '@awesome.me/webawesome/dist/components/icon/icon.js'
import '@awesome.me/webawesome/dist/components/markdown/markdown.js'
import '@awesome.me/webawesome/dist/components/option/option.js'
import '@awesome.me/webawesome/dist/components/select/select.js'
import {highlightCode} from './syntax.js'

const THEME_CONFIG = {
    default: ['wa-theme-default', 'wa-palette-default'],
    awesome: ['wa-theme-awesome', 'wa-palette-bright'],
    shoelace: ['wa-theme-shoelace', 'wa-palette-shoelace'],
}

const MODE_CLASSES = ['wa-light', 'wa-dark']
const BRAND_COLORS = ['blue', 'red', 'orange', 'green', 'cyan', 'purple', 'pink']
const THEME_CLASSES = Object.values(THEME_CONFIG).flat()

const readSavedConfig = () => {
    try {
        return JSON.parse(localStorage.getItem('lgs1920-countdown-demo-config') ?? '{}')
    } catch {
        return {}
    }
}

const saveConfig = (config) => {
    try {
        localStorage.setItem('lgs1920-countdown-demo-config', JSON.stringify(config))
    } catch {
    }
}

const highlightMarkdown = () => {
    document.querySelectorAll('.readme-content pre code').forEach((code) => {
        if (code.dataset.syntaxHighlighted === 'true') {
            return
        }

        const languageClass = [...code.classList].find((className) => className.startsWith('language-'))
        const language = languageClass?.slice('language-'.length) ?? 'text'

        code.innerHTML = highlightCode(code.textContent ?? '', language)
        code.dataset.syntaxHighlighted = 'true'
    })

    document.querySelectorAll('a').forEach((link) => {
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
    })
}

const applyDemoTheme = () => {
    const savedConfig = readSavedConfig()

    const themeClasses = THEME_CONFIG[savedConfig.theme] ?? THEME_CONFIG.default
    const modeClass = savedConfig.mode === 'light' ? 'wa-light' : 'wa-dark'
    const brandColor = BRAND_COLORS.includes(savedConfig.color) ? savedConfig.color : 'blue'

    document.documentElement.classList.remove(...THEME_CLASSES, ...MODE_CLASSES, ...BRAND_COLORS.map((color) => `wa-brand-${color}`))
    document.documentElement.classList.add(...themeClasses, modeClass, `wa-brand-${brandColor}`)
}

const bannerThemeControl = document.querySelector('#banner-theme-control')
const bannerModeControl = document.querySelector('#banner-mode-control')
const bannerColorControl = document.querySelector('#banner-color-control')
const savedConfig = readSavedConfig()

bannerThemeControl.value = THEME_CONFIG[savedConfig.theme] ? savedConfig.theme : 'default'
bannerModeControl.value = savedConfig.mode === 'light' ? 'light' : 'dark'
bannerColorControl.value = BRAND_COLORS.includes(savedConfig.color) ? savedConfig.color : 'blue'

applyDemoTheme()

bannerThemeControl.addEventListener('change', () => {
    const config = readSavedConfig()
    config.theme = bannerThemeControl.value
    saveConfig(config)
    applyDemoTheme()
})

bannerModeControl.addEventListener('change', () => {
    const config = readSavedConfig()
    config.mode = bannerModeControl.value
    saveConfig(config)
    applyDemoTheme()
})

bannerColorControl.addEventListener('change', () => {
    const config = readSavedConfig()
    config.color = bannerColorControl.value
    saveConfig(config)
    applyDemoTheme()
})

const readmeContent = document.querySelector('.readme-content')
if (readmeContent) {
    new MutationObserver(highlightMarkdown).observe(readmeContent, {childList: true, subtree: true})
    highlightMarkdown()
}
