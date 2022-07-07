const Koa = require('koa')
const KoaBody = require('koa-body')

const userRouter = require('../router/user.router')

const errHandler = require('../app/errHandler')

const app = new Koa()

app.use(KoaBody())
app.use(userRouter.routes())

//错误处理
app.on('error', errHandler)

module.exports = app