const express = require('express')
const client = require('prom-client')
const app = express()

function startMetricsServer() {

    const collectDefaultMetrics = client.collectDefaultMetrics

    collectDefaultMetrics();

    app.get('/metrics', async (req, res) => {

        res.set("Content-Type", client.register.contentType)

        return res.send(await client.register.metrics())
    })


    app.listen(9100, () => {
        log.info('Metrics server started at port 9100');
    })
}

module.exports = startMetricsServer