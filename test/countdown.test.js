import assert from 'node:assert/strict'
import test from 'node:test'

import {GOLDEN_RATIO, getCountdownAnimation, getCountdownAppearance, getCountdownParts, getCountdownRatio, getCountdownState, Lgs1920Countdown, MAX_COUNTDOWN_DAYS} from '../src/countdown.js'

test('exposes custom element lifecycle callbacks on its prototype', () => {
    assert.equal(typeof Lgs1920Countdown.prototype.connectedCallback, 'function')
    assert.equal(typeof Lgs1920Countdown.prototype.disconnectedCallback, 'function')
    assert.equal(typeof Lgs1920Countdown.prototype.attributeChangedCallback, 'function')
})

test('observes locale changes for immediate re-rendering', () => {
    assert.ok(Lgs1920Countdown.observedAttributes.includes('lang'))
})

test('uses the golden ratio as the default card height-to-width ratio', () => {
    assert.equal(getCountdownRatio(), GOLDEN_RATIO)
    assert.equal(getCountdownRatio('1.25'), 1.25)
})

test('falls back to the golden ratio for invalid card ratios', () => {
    assert.equal(getCountdownRatio('0'), GOLDEN_RATIO)
    assert.equal(getCountdownRatio('-1'), GOLDEN_RATIO)
    assert.equal(getCountdownRatio('not-a-ratio'), GOLDEN_RATIO)
})

test('uses the Web Awesome filled-outlined appearance by default', () => {
    assert.equal(getCountdownAppearance(), 'filled-outlined')
    assert.equal(getCountdownAppearance('filled'), 'filled')
    assert.equal(getCountdownAppearance('outlined'), 'outlined')
    assert.equal(getCountdownAppearance('filled-outlined'), 'filled-outlined')
    assert.equal(getCountdownAppearance('custom'), 'filled-outlined')
})

test('supports fade for every appearance and forces it for outlined cards', () => {
    assert.equal(getCountdownAnimation(), 'flip')
    assert.equal(getCountdownAnimation('fade', 'filled'), 'fade')
    assert.equal(getCountdownAnimation('fade', 'filled-outlined'), 'fade')
    assert.equal(getCountdownAnimation('flip', 'outlined'), 'fade')
    assert.equal(getCountdownAnimation('custom', 'filled'), 'flip')
})

test('calculates days, hours, minutes, and seconds from an absolute target date', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    const target = new Date('2026-01-03T04:05:06.000Z')

    assert.deepEqual(getCountdownParts(target, now), {
        totalSeconds: 187506,
        days:        2,
        hours:       4,
        minutes:     5,
        seconds:     6,
    })
})

test('rounds a partial second up so the visible countdown does not reach zero early', () => {
    const now = new Date('2026-01-01T00:00:00.001Z')
    const target = new Date('2026-01-01T00:00:01.000Z')

    assert.equal(getCountdownParts(target, now).seconds, 1)
})

test('parses timezone offsets before calculating the remaining duration', () => {
    const state = getCountdownState('2026-01-02T00:00:00+01:00', new Date('2026-01-01T00:00:00.000Z'))

    assert.equal(state.status, 'ready')
    assert.equal(state.parts?.days, 0)
    assert.equal(state.parts?.hours, 23)
})

test('accepts a target exactly 999 days away', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    const target = new Date(now.getTime() + MAX_COUNTDOWN_DAYS * 24 * 60 * 60 * 1000)

    assert.equal(getCountdownState(target.toISOString(), now).status, 'ready')
})

test('rejects a target more than 999 days away', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')
    const target = new Date(now.getTime() + (MAX_COUNTDOWN_DAYS + 1) * 24 * 60 * 60 * 1000)

    assert.equal(getCountdownState(target.toISOString(), now).status, 'too-far')
})

test('handles missing, invalid, and expired targets', () => {
    const now = new Date('2026-01-01T00:00:00.000Z')

    assert.equal(getCountdownState(null, now).status, 'missing')
    assert.equal(getCountdownState('not-a-date', now).status, 'invalid')
    assert.equal(getCountdownState('2025-12-31T23:59:59.000Z', now).status, 'expired')
    assert.deepEqual(getCountdownState('2025-12-31T23:59:59.000Z', now).parts, {
        totalSeconds: 0,
        days:        0,
        hours:       0,
        minutes:     0,
        seconds:     0,
    })
})
