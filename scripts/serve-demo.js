const distDirectory = new URL('../dist/', import.meta.url)
const port = Number(Bun.env.PORT || 4173)

const server = Bun.serve({
    port,
    async fetch(request) {
        const url = new URL(request.url)
        const relativePath = url.pathname === '/' ? 'index.html' : url.pathname.slice(1)

        if (relativePath.includes('..')) {
            return new Response('Not found', {status: 404})
        }

        const file = Bun.file(new URL(relativePath, distDirectory))
        if (await file.exists()) {
            return new Response(file)
        }

        return new Response('Not found', {status: 404})
    },
})

console.log(`Countdown demo available at http://localhost:${server.port}`)
