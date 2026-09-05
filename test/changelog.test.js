import assert from 'node:assert/strict'
import test from 'node:test'

import {parseReleaseTags, renderChangelogEntries} from '../scripts/changelog.js'

test('parses release tags and renders their notes as HTML', () => {
    const releases = parseReleaseTags([
        'v2.0.0',
        '2026-09-05T10:30:00+02:00',
        'v2.0.0\n\nChanges:\n- Added <countdown> support.\n\nChanges between releases: https://github.com/lgs1920/countdown/compare/v1.2.5...v2.0.0',
        '',
    ].join('\0'))

    assert.deepEqual(releases, [{
        tag: 'v2.0.0',
        publishedAt: '2026-09-05T10:30:00+02:00',
        changes: ['Added <countdown> support.'],
        compareUrl: 'https://github.com/lgs1920/countdown/compare/v1.2.5...v2.0.0',
    }])

    const html = renderChangelogEntries(releases)

    assert.match(html, /<h2>v2\.0\.0<\/h2>/)
    assert.match(html, /September 5, 2026/)
    assert.match(html, /Added &lt;countdown&gt; support\./)
    assert.match(html, /target="_blank"/)
})

test('renders a clear message for releases without a summary', () => {
    const releases = parseReleaseTags(['v1.0.0', '2026-09-03T12:00:00Z', 'v1.0.0', ''].join('\0'))

    assert.match(renderChangelogEntries(releases), /No release summary was recorded for this version\./)
})
