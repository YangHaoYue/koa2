const Koa = require('koa')
const KoaBody = require('koa-body')

const userRouter = require('../router/user.router')

const app = new Koa()

app.use(KoaBody())
app.use(userRouter.routes())

module.exports = app