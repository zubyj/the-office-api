import Analytics from 'analytics'
import segmentPlugin from '@analytics/segment'

const analytics = Analytics({
    app: 'the-office-script-api-server',
    plugins: [
        segmentPlugin({
            writeKey: 'Q6Z0yZ9V2kIaYisKsp8sFM7hVYG3hXeW',
        })
    ]
})

export default analytics;