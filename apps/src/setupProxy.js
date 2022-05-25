const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = app => {
    app.use(
        createProxyMiddleware(
            ['/data', '/wss'],
            {
                target: 'http://127.0.0.1:4885',
                changeOrigin: true,
                ws: true,
                router: {
                  '/wss': 'ws://127.0.0.1:8001'
                }
            }
        )
    )
}
