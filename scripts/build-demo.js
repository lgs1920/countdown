/*******************************************************************************
 *
 * This file is part of the LGS1920/countdown project.
 *
 * File: build-demo.js
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

import {copyFile, mkdir, rm} from 'node:fs/promises'
import {parseReleaseTags, renderChangelogEntries} from './changelog.js'

const packageJson = await Bun.file('./package.json').json()

const readGitReleases = () => {
    const result = Bun.spawnSync([
        'git',
        'for-each-ref',
        '--sort=-version:refname',
        '--format=%(refname:short)%00%(creatordate:iso-strict)%00%(contents)%00',
        'refs/tags/v*',
    ], {stdout: 'pipe', stderr: 'pipe'})

    if (result.exitCode !== 0) {
        return []
    }

    return parseReleaseTags(new TextDecoder().decode(result.stdout))
}

await rm('./dist', {force: true, recursive: true})

const result = await Bun.build({
    entrypoints: ['./demo/app.js', './demo/readme.js'],
    naming: '[name].[ext]',
    outdir: './dist',
    target: 'browser',
    minify: false,
    sourcemap: 'inline',
})

if (!result.success) {
    for (const message of result.logs) {
        console.error(message)
    }

    process.exit(1)
}

const stylesResult = await Bun.build({
    entrypoints: ['./demo/webawesome.css'],
    naming: '[name].[ext]',
    outdir: './dist',
    target: 'browser',
    minify: false,
})

if (!stylesResult.success) {
    for (const message of stylesResult.logs) {
        console.error(message)
    }

    process.exit(1)
}

const demoHtml = (await Bun.file('./demo/index.html').text()).replace(
    '@lgs1920/countdown vx.y.z',
    `@lgs1920/countdown v${packageJson.version}`,
)

const readmeMarkdown = (await Bun.file('./README.md').text()).replaceAll('</script', '<\\/script')
const changelogTemplate = await Bun.file('./demo/changelog.html').text()
const changelogHtml = changelogTemplate.replace('<!-- CHANGELOG_ENTRIES -->', renderChangelogEntries(readGitReleases()))
const readmeHtml = `<!doctype html>
<html lang="en" class="wa-theme-default wa-palette-default wa-brand-blue wa-dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="HTML reference documentation for the LGS1920 countdown Web Component.">
    <title>Component reference · LGS1920 Countdown</title>
    <link rel="stylesheet" href="./webawesome.css">
    <link rel="stylesheet" href="./styles.css">
</head>
<body>
<main class="demo-shell">
    <nav class="site-banner" aria-label="Site navigation">
        <div class="site-banner-left">
            <a class="site-banner-logo" href="https://lgs1920.fr/" target="_blank" rel="noopener noreferrer" aria-label="LGS1920 website">
                <img src="./assets/logo/logo-horizontal.png" alt="LGS1920">
            </a>
            <div class="site-banner-pages">
                <a href="./" target="_blank" rel="noopener noreferrer">Demo</a>
                <a href="./readme.html" target="_blank" rel="noopener noreferrer" aria-current="page">README</a>
                <a href="./changelog.html" target="_blank" rel="noopener noreferrer">Changelog</a>
            </div>
        </div>
        <div class="site-banner-controls" aria-label="Demo settings">
            <wa-select id="banner-theme-control" label="Theme" size="xs" value="default">
                <wa-option value="default">Default</wa-option>
                <wa-option value="awesome">Awesome</wa-option>
                <wa-option value="shoelace">Shoelace</wa-option>
            </wa-select>
            <wa-select id="banner-mode-control" label="Color mode" size="xs" value="dark">
                <wa-option value="light"><wa-icon slot="start" name="sun"></wa-icon>Light</wa-option>
                <wa-option value="dark"><wa-icon slot="start" name="moon"></wa-icon>Dark</wa-option>
            </wa-select>
            <wa-select id="banner-color-control" label="Brand color" size="xs" value="blue">
                <wa-option value="blue">Blue</wa-option>
                <wa-option value="red">Red</wa-option>
                <wa-option value="orange">Orange</wa-option>
                <wa-option value="green">Green</wa-option>
                <wa-option value="cyan">Cyan</wa-option>
                <wa-option value="purple">Purple</wa-option>
                <wa-option value="pink">Pink</wa-option>
            </wa-select>
        </div>
        <div class="site-banner-external">
            <a href="https://github.com/lgs1920/countdown" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
                <wa-icon name="github" family="brands"></wa-icon>
            </a>
            <a href="https://www.npmjs.com/package/@lgs1920/countdown" target="_blank" rel="noopener noreferrer" aria-label="npm package">
                <wa-icon name="npm" family="brands"></wa-icon>
            </a>
        </div>
    </nav>
    <nav class="demo-breadcrumb" aria-label="Breadcrumb">
        <wa-breadcrumb label="Page navigation">
            <wa-breadcrumb-item href="./" target="_blank" rel="noopener noreferrer">Home</wa-breadcrumb-item>
            <wa-breadcrumb-item aria-current="page">Component reference</wa-breadcrumb-item>
        </wa-breadcrumb>
    </nav>
    <article class="readme-content">
        <wa-markdown>
            <script type="text/markdown">
${readmeMarkdown}
            </script>
        </wa-markdown>
    </article>
</main>
<script type="module" src="./readme.js"></script>
</body>
</html>`

await Bun.write('./dist/index.html', demoHtml)
await Bun.write('./dist/readme.html', readmeHtml)
await Bun.write('./dist/changelog.html', changelogHtml)
await Bun.write('./dist/styles.css', Bun.file('./demo/styles.css'))
await mkdir('./dist/assets/logo', {recursive: true})
await copyFile('./demo/assets/logo/logo-horizontal.png', './dist/assets/logo/logo-horizontal.png')
console.log('Demo built in ./dist')
