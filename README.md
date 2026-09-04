# `@lgs1920/countdown`

`@lgs1920/countdown` is a Web Component designed exclusively for applications using [Web Awesome](https://webawesome.com/). It renders a countdown with optional custom unit labels and Web Awesome digit cards. It requires Web Awesome at runtime for its stylesheet, theme tokens, cards, animations, and error messages. It cannot function correctly outside a Web Awesome environment.

The current release is `1.2.0`. See the [npm package](https://www.npmjs.com/package/@lgs1920/countdown).

The live demo is based on [Build Awesome (formerly Eleventy/11ty)](https://www.11ty.dev/), built with [Web Awesome](https://webawesome.com/), and uses icons from [Font Awesome](https://fontawesome.com/).

## Breaking change in 1.2

Version 1.2 removes the `lang` attribute. Set the translated unit labels through the `legend` property instead:

```js
countdown.legend = {
    days: 'Jours',
    hours: 'Heures',
    minutes: 'Minutes',
    seconds: 'Secondes',
}
```

Set `legend` to `false` to hide the unit labels.

The component supports:

- ISO 8601 target dates with explicit timezone offsets;
- Days from one to three digits, with a hard limit of 999 days;
- two-digit Hours, Minutes, and Seconds values;
- `filled`, `outlined`, `filled-outlined`, and `plain` card appearances;
- FlipDown-style `flip` transitions and `fade` transitions;
- automatic `fade` fallback for outlined and plain cards;
- an adjustable `height / width` ratio using the golden ratio by default;
- customizable or optional unit labels through the `legend` property;
- one horizontal row at every viewport size.

## Installation

The package requires Node.js 20 or newer, or Bun 1.1 or newer.

Install it with your package manager:

```bash
npm install @lgs1920/countdown
```

```bash
bun add @lgs1920/countdown
```

The package declares Web Awesome as a direct dependency, so it is installed automatically. Import Web Awesome's stylesheet in the host application, then import the countdown package:

```js
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@lgs1920/countdown'
```

The countdown package automatically registers the Web Awesome components it needs and registers `<lgs1920-countdown>` itself. Keeping the stylesheet import in the host application lets that application control when and how Web Awesome styles are loaded.

## Web Awesome dependencies

The countdown uses these Web Awesome components at runtime:

| Component | Used for |
| --- | --- |
| `wa-card` | The individual digit cards and their `filled`, `outlined`, `filled-outlined`, and `plain` appearances. |
| `wa-animation` | The `flip` and `fade` transitions applied when a digit changes. |
| `wa-callout` | The error state shown for missing, invalid, or out-of-range target dates. |

The Web Awesome stylesheet provides the `--wa-*` theme, typography, spacing, border, radius, and color tokens consumed by the component. A host application can override these tokens or the `--lgs-countdown-*` custom properties documented below.

Use the public package entry point shown above so the three Web Awesome components are registered automatically. If you import the lower-level `@lgs1920/countdown/countdown` entry point directly, you must load the stylesheet and register the Web Awesome components yourself before using `<lgs1920-countdown>`:

```js
import '@awesome.me/webawesome/dist/styles/webawesome.css'
import '@awesome.me/webawesome/dist/components/animation/animation.js'
import '@awesome.me/webawesome/dist/components/callout/callout.js'
import '@awesome.me/webawesome/dist/components/card/card.js'
import '@lgs1920/countdown/countdown'
```

## Themes in the demo

The demo includes the three free Web Awesome themes and their matching free palettes:

| Theme | Theme class | Palette class |
| --- | --- | --- |
| Default | `wa-theme-default` | `wa-palette-default` |
| Awesome | `wa-theme-awesome` | `wa-palette-bright` |
| Shoelace | `wa-theme-shoelace` | `wa-palette-shoelace` |

The theme selector applies the corresponding classes to `<html>`. The color-mode selector adds either `wa-light` or `wa-dark`. The package does not impose a theme or color mode; the host application remains free to choose its own Web Awesome theme.

The demo also exposes a brand-color selector using Web Awesome's free color variants: Blue, Red, Orange, Green, Cyan, Purple, and Pink. These values are applied as `wa-brand-*` classes on `<html>`.

## Basic usage

The only required value is an ISO 8601 target date. Include an explicit timezone so the target is unambiguous across browsers and locations.

```html
<lgs1920-countdown
    target-date="2026-12-31T23:59:59+01:00"
></lgs1920-countdown>
```

The component renders four units in this order:

```text
Days     Hours     Minutes     Seconds
```

The countdown does not manage languages. Supply the translated unit labels through the `legend` property:

```js
const countdown = document.querySelector('lgs1920-countdown')
countdown.legend = {
    days: 'Jours',
    hours: 'Heures',
    minutes: 'Minutes',
    seconds: 'Secondes',
}
```

To display only the digits:

```js
countdown.legend = false
```

The package registers the custom element once and exports the component class and its date and option helpers:

```js
import {getCountdownState, Lgs1920Countdown} from '@lgs1920/countdown'
```

## Attributes

| Attribute | Values | Default | Description |
| --- | --- | --- | --- |
| `target-date` | ISO 8601 date/time | None | Counts down to the target. Missing or invalid values render an error state. |
| `appearance` | `filled`, `outlined`, `filled-outlined`, `plain` | `filled-outlined` | Selects the Web Awesome card treatment for every digit. |
| `animation` | `flip`, `fade` | `flip` | Selects the transition used when a digit changes. |
| `ratio` | Any positive finite number | `1.618033988749895` | Sets the card `height / width` ratio. The default is the golden ratio. |

## Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `legend` | Object with `days`, `hours`, `minutes`, and `seconds` strings, or `false` | English labels | Sets the visible and accessible label for each countdown unit. Set to `false` to hide unit labels. |

### `target-date` validation

The countdown accepts targets up to 999 days from the current time. Days use one to three cards, with a maximum value of `999`. Hours, minutes, and seconds always use two cards and are zero-padded.

- A missing target displays an error message.
- An invalid date displays an error message.
- A target more than 999 days away displays a range error.
- An expired target remains visible at `0` days, `00` hours, `00` minutes, and `00` seconds.

```html
<!-- Accepted: days are within the three-card limit -->
<lgs1920-countdown target-date="2026-12-31T23:59:59+01:00"></lgs1920-countdown>

<!-- Invalid: this is not an ISO 8601 date -->
<lgs1920-countdown target-date="not-a-date"></lgs1920-countdown>
```

### `ratio`

The ratio is calculated as `height / width`. It must be a positive finite number. Invalid values fall back to the golden ratio.

```html
<lgs1920-countdown
    ratio="1.25"
    target-date="2026-12-31T23:59:59+01:00"
></lgs1920-countdown>
```

## Card appearances

The component uses the standard Web Awesome appearance names:

- `filled`: opaque themed fill without a border;
- `outlined`: transparent background with a standard border;
- `filled-outlined`: opaque themed fill with a standard border;
- `plain`: transparent background without a border.

```html
<lgs1920-countdown appearance="filled" target-date="2026-12-31T23:59:59+01:00"></lgs1920-countdown>
<lgs1920-countdown appearance="outlined" target-date="2026-12-31T23:59:59+01:00"></lgs1920-countdown>
<lgs1920-countdown appearance="filled-outlined" target-date="2026-12-31T23:59:59+01:00"></lgs1920-countdown>
<lgs1920-countdown appearance="plain" target-date="2026-12-31T23:59:59+01:00"></lgs1920-countdown>
```

## Digit animations

`flip` is the default transition for `filled` and `filled-outlined`. It uses the horizontal FlipDown-style rotor: the upper leaf rotates around the horizontal center axis and reveals the next value on its reverse face.

`fade` is available with every appearance. It fades the complete digit in and out, without using a rotor. The full fade lasts 650 ms, the same duration as the flip transition.

`outlined` and `plain` never use a rotor. When `animation="flip"` is requested with either appearance, the component automatically resolves the transition to `fade`.

```html
<!-- FlipDown-style transition -->
<lgs1920-countdown
    appearance="filled-outlined"
    animation="flip"
    target-date="2026-12-31T23:59:59+01:00"
></lgs1920-countdown>

<!-- Fade transition with a filled card -->
<lgs1920-countdown
    appearance="filled"
    animation="fade"
    target-date="2026-12-31T23:59:59+01:00"
></lgs1920-countdown>

<!-- The requested flip is automatically replaced by fade -->
<lgs1920-countdown
    appearance="outlined"
    animation="flip"
    target-date="2026-12-31T23:59:59+01:00"
></lgs1920-countdown>

<!-- Plain appearance always uses fade -->
<lgs1920-countdown
    appearance="plain"
    animation="flip"
    target-date="2026-12-31T23:59:59+01:00"
></lgs1920-countdown>
```

## Theme integration

The component inherits Web Awesome color, typography, spacing, border, and radius tokens. Its default filled surface is derived from `--wa-color-brand-fill-quiet`, and its default digit color is `--wa-color-brand`.

The following component properties can be overridden by the host application:

| Custom property | Purpose | Default |
| --- | --- | --- |
| `--lgs-countdown-card-surface` | Filled card and rotor background | A mix of `--wa-color-brand-fill-quiet` and `--wa-color-neutral-10` |
| `--lgs-countdown-card-border` | Outlined card border | `--wa-color-neutral-border-normal` |
| `--lgs-countdown-brand-color` | Digit color | `--wa-color-brand` |
| `--lgs-countdown-legend-color` | Unit label color | `--wa-color-text-normal` |
| `--lgs-countdown-card-radius` | Digit card and leaf radius | `--wa-panel-border-radius` |
| `--lgs-countdown-digit-gap` | Gap between digits in one unit | `--wa-space-3xs` (`2px`) |
| `--lgs-countdown-unit-gap` | Gap between Days, Hours, Minutes, and Seconds | `clamp(var(--wa-space-m), 4cqi, var(--wa-space-xl))` |

The visible gap between digits in one unit is controlled by `--lgs-countdown-digit-gap` and defaults to Web Awesome's `--wa-space-3xs` token (`2px`). The unit gap is independent from that digit gap. A host application can apply its own spacing or brand values without coupling that data to the component.

The default unit gap is responsive to the countdown's inline size: it grows progressively from `--wa-space-m` on narrow cards to `--wa-space-xl` on wide cards. The `4cqi` preferred value uses the component's container query width.

The four units always remain on one line. Card widths scale from the available inline size using the three-digit Days maximum, while the small-screen label token keeps unit names readable on narrow devices.

```css
.launch-countdown {
    --lgs-countdown-card-surface: color-mix(in oklab, var(--wa-color-brand-fill-quiet) 72%, var(--wa-color-neutral-10) 28%);
    --lgs-countdown-card-border: var(--wa-color-surface-border);
    --lgs-countdown-brand-color: var(--wa-color-brand);
    --lgs-countdown-legend-color: var(--wa-color-text-normal);
    --lgs-countdown-card-radius: var(--wa-panel-border-radius);
    --lgs-countdown-digit-gap: var(--wa-space-3xs);
}
```

## Live examples

Run the demo locally:

```bash
bun install
bun run dev
```

Open `http://localhost:4173`.

The demo covers appearances, animations, languages, ratios, responsive layout, themes, color modes, and brand colors. Controls update the countdown immediately and persist in `localStorage`.

To reset saved settings, run `localStorage.removeItem('lgs1920-countdown-demo-config')` in the browser console and reload the page.

GitHub Actions publishes the demo to GitHub Pages when `main` changes.

## Publish on npm

The release script manages the package version and keeps the release displayed above in sync with `package.json`:

```bash
# 1.0.4 -> 1.0.5 (patch is the default)
bun run publish

# 1.0.4 -> 1.1.0
bun run publish --minor

# 1.0.4 -> 2.0.0
bun run publish --major
```

The script stops when there are uncommitted changes or when no changes have been made in `src` or `scripts` since the last `v*` tag. When it succeeds, it updates `package.json` and this README, creates the version commit and tag, then pushes them to `main`. The tag starts the GitHub Actions workflow, which runs the tests, publishes the package to npm with the `NPM_TOKEN` repository secret, and creates the GitHub release.

## License

MIT. See [`LICENSE`](LICENSE).
