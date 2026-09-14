const { createServer } = require('http')
const next = require('next')

const app = next({ dev: false })
const handle = app.getRequestHandler()

const PORT = process.env.PORT || 3000

app.prepare().then(() => {
    createServer((req, res) => {
        handle(req, res)
    }).listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`)
    })
})