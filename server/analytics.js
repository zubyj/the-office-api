import Analytics from 'analytics'
import segmentPlugin from '@analytics/segment'
import dotenv from 'dotenv'

dotenv.config(); // Load environment variables from .env file

const analytics = Analytics({
    app: 'the-office-script-api-server',
    plugins: [
        segmentPlugin({
            writeKey: process.env.SEGMENT_WRITE_KEY
        })
    ]
})

export default analytics;