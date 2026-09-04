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

const packageJson = await Bun.file('./package.json').json()

await rm('./dist', {force: true, recursive: true})

const result = await Bun.build({
    entrypoints: ['./demo/app.js'],
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

await Bun.write('./dist/index.html', demoHtml)
await Bun.write('./dist/styles.css', Bun.file('./demo/styles.css'))
await mkdir('./dist/assets/logo', {recursive: true})
await copyFile('./demo/assets/logo/logo-horizontal.png', './dist/assets/logo/logo-horizontal.png')
console.log('Demo built in ./dist')
