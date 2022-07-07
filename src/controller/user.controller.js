const { createUser, getUserInfo } = require('../service/user.service')
const { userRegisterError } = require('../constant/err.type')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config.default')

class UserController {
    async register(ctx, next) {
        // 1. 获取数据
        const { user_name, password } = ctx.request.body

        // 2. 操作数据库
        try {
            const res = await createUser(user_name, password)
                // console.log(res)
                // 3. 返回结果
            ctx.body = {
                code: 0,
                message: '用户注册成功',
                result: {
                    id: res.id,
                    user_name: res.user_name,
                },
            }
        } catch (error) {
            console.error(error);
            ctx.app.emit('error', userRegisterError, ctx)
        }
    }

    async login(ctx, next) {
        const { user_name, password } = ctx.request.body
            //获取用户信息（token的payload中，记录id，user_name,is_admin）
        try {
            const { password, ...resUser } = await getUserInfo({ user_name })

            ctx.body = {
                code: 0,
                message: '登陆成功',
                result: {
                    token: jwt.sign(resUser, JWT_SECRET, { expiresIn: '1d' }),
                }
            }
        } catch (error) {
            console.error('用户登陆失败', error);
            ctx.app.emit('error', userRegisterError, ctx)
        }
    }
}

module.exports = new UserController()