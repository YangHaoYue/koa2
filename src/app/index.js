const path = require('path')

const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static')

const errHandler = require('../app/errHandler')

const router = require('../router')

const app = new Koa()

app.use(KoaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '../uploads'),
        keepExtensions: true
    }
}))
app.use(KoaStatic(path.join(__dirname, '../uploads')))
app.use(router.routes())
app.use(router.allowedMethods())

//错误处理
app.on('error', errHandler)

module.exports = app