const Koa = require('koa')
const KoaBody = require('koa-body')

const errHandler = require('../app/errHandler')

const router = require('../router')

const app = new Koa()

app.use(KoaBody())
app.use(router.routes())
app.use(router.allowedMethods())

//错误处理
app.on('error', errHandler)

module.exports = app