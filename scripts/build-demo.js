import {rm} from 'node:fs/promises'

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

await Bun.write('./dist/index.html', Bun.file('./demo/index.html'))
await Bun.write('./dist/styles.css', Bun.file('./demo/styles.css'))
console.log('Demo built in ./dist')
