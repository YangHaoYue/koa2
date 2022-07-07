const { getUserInfo } = require('../service/user.service')
const {
    userFormateError,
    userAlreadyExited,
    userRegisterError,
    userDoesNotExist,
    userLoginError,
    invalidPassword
} = require('../constant/err.type')
const bcrypt = require('bcryptjs')


const userValidator = async(ctx, next) => {
    const { user_name, password } = ctx.request.body
        //合法性
    if (!user_name || !password) {
        console.error('用户名或者密码为空', ctx.request.body);
        ctx.app.emit('error', userFormateError, ctx)
        return
    }
    await next()
}

const verifyUser = async(ctx, next) => {
    const { user_name } = ctx.request.body
        //合理性
    try {
        const res = await getUserInfo({ user_name })
        if (res) {
            console.error('用户名已经存在', { user_name });
            ctx.app.emit('error', userAlreadyExited, ctx)
            return
        }
    } catch (error) {
        console.error('获取用户信息错误', error);
        ctx.app.emit('error', userRegisterError, ctx)
        return
    }
    await next()
}

const crpytPassword = async(ctx, next) => {
    const { password } = ctx.request.body
    const salt = bcrypt.genSaltSync(10);
    //hash保存的是密文
    const hash = bcrypt.hashSync(password, salt);

    ctx.request.body.password = hash

    await next()
}

const verifyLogin = async(ctx, next) => {

    const { user_name, password } = ctx.request.body

    try {
        const res = await getUserInfo({ user_name })
            //1.判断用户是否存在（不存在报错）
        if (!res) {
            console.error('用户名不存在', user_name);
            ctx.app.emit('error', userDoesNotExist, ctx)
            return
        }
        //2.判断密码是否匹配（不匹配报错）
        if (bcrypt.compareSync(password, res.password)) {
            ctx.app.emit('error', invalidPassword, ctx)
            return
        }
    } catch (error) {
        console.error(error);
        return ctx.app.emit('error', userLoginError, ctx)
    }

    await next()
}


module.exports = {
    userValidator,
    verifyUser,
    crpytPassword,
    verifyLogin
}