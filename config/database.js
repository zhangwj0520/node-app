if (process.env.NODE_ENV == "production") {
    module.exports = {
        mongoURL: "mongodb://root:admin123@ds153815.mlab.com:53815/node-app-0923"
    }
} else {
    module.exports = {
        mongoURL: "mongodb://localhost:27017/vue-node-ele"
    }
}