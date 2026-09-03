import {watch} from 'node:fs'

const buildDemo = () => {
    const result = Bun.spawnSync([process.execPath, 'scripts/build-demo.js'], {
        stdout: 'inherit',
        stderr: 'inherit',
    })

    if (result.exitCode !== 0) {
        console.error('La reconstruction de la démo a échoué. Le watch continue.')
    }
}

buildDemo()

let rebuildTimer
const scheduleBuild = () => {
    clearTimeout(rebuildTimer)
    rebuildTimer = setTimeout(buildDemo, 100)
}

const watchers = [
    watch('./src', scheduleBuild),
    watch('./demo', scheduleBuild),
]

await import('./serve-demo.js')

const stop = () => {
    clearTimeout(rebuildTimer)
    watchers.forEach((watcher) => watcher.close())
    process.exit(0)
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)
