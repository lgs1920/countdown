/*******************************************************************************
 *
 * This file is part of the LGS1920/countdown project.
 *
 * File: syntax.js
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

const KEYWORDS = new Set([
    'as', 'async', 'await', 'class', 'const', 'else', 'export', 'extends', 'from',
    'function', 'if', 'import', 'in', 'let', 'new', 'of', 'return', 'static',
    'throw', 'try', 'typeof', 'var', 'while', 'with', 'yield',
])

const LITERALS = new Set(['false', 'null', 'true', 'undefined'])
const HTML_LANGUAGES = new Set(['html', 'jsx', 'svg', 'xml'])

const escapeHtml = (value) => value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

const highlightHtmlTag = (token) => {
    const tagMatch = token.match(/^(<\/?)([a-z][\w:-]*)([\s\S]*?)(\/?>)$/i)

    if (!tagMatch) {
        return `<span class="syntax-tag">${escapeHtml(token)}</span>`
    }

    const [, opening, tagName, attributes, closing] = tagMatch
    const attributePattern = /([:\w-]+)(\s*=\s*)("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\s>]+)/g
    let highlightedAttributes = ''
    let lastIndex = 0

    for (const match of attributes.matchAll(attributePattern)) {
        const [attribute, name, operator, value] = match
        const index = match.index ?? 0

        highlightedAttributes += escapeHtml(attributes.slice(lastIndex, index))
        highlightedAttributes += `<span class="syntax-attribute">${escapeHtml(name)}</span>`
        highlightedAttributes += `<span class="syntax-operator">${escapeHtml(operator)}</span>`
        highlightedAttributes += `<span class="syntax-string">${escapeHtml(value)}</span>`
        lastIndex = index + attribute.length
    }

    highlightedAttributes += escapeHtml(attributes.slice(lastIndex))

    return `<span class="syntax-tag"><span class="syntax-punctuation">${escapeHtml(opening)}</span><span class="syntax-tag-name">${escapeHtml(tagName)}</span>${highlightedAttributes}<span class="syntax-punctuation">${escapeHtml(closing)}</span></span>`
}

const getTokenClass = (token, language) => {
    if (/^(?:\/\/|\/\*|<!--|#)/.test(token) && !(language === 'css' && /^#[0-9a-f]/i.test(token))) {
        return 'syntax-comment'
    }

    if (/^<\/?[a-z]/i.test(token)) {
        return 'syntax-tag'
    }

    if (/^[`"']/.test(token)) {
        return 'syntax-string'
    }

    if (LITERALS.has(token)) {
        return 'syntax-literal'
    }

    if (/^\d/.test(token)) {
        return 'syntax-number'
    }

    if (KEYWORDS.has(token)) {
        return 'syntax-keyword'
    }

    return ''
}

const renderToken = (token, language) => {
    if (HTML_LANGUAGES.has(language) && /^<\/?[a-z]/i.test(token)) {
        return highlightHtmlTag(token)
    }

    const className = getTokenClass(token, language)

    return className ? `<span class="${className}">${escapeHtml(token)}</span>` : escapeHtml(token)
}

export const highlightCode = (code, language = 'text') => {
    const tokenPattern = /<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/[^\n]*|#[^\n]*|`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|<\/?[a-z][^>]*>|\b(?:false|null|true|undefined|as|async|await|class|const|else|export|extends|from|function|if|import|in|let|new|of|return|static|throw|try|typeof|var|while|with|yield)\b|\b\d+(?:\.\d+)?\b/gi
    let highlighted = ''
    let lastIndex = 0

    for (const match of code.matchAll(tokenPattern)) {
        const token = match[0]
        const index = match.index ?? 0

        highlighted += escapeHtml(code.slice(lastIndex, index))
        highlighted += renderToken(token, language)
        lastIndex = index + token.length
    }

    return highlighted + escapeHtml(code.slice(lastIndex))
}
