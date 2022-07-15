const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/config.default')
const { tokenExpiredError, invalidToken, hadNotAdminPermission } = require('../constant/err.type')

const auth = async(ctx, next) => {
    const { authorization = "" } = ctx.request.header
    const token = authorization.replace('Bearer ', "")

    try {
        const user = jwt.verify(token, JWT_SECRET)
        ctx.state.user = user

        await next()
    } catch (error) {
        switch (error.name) {
            case 'TokenExpiredError':
                console.error('token已过期', error);
                return ctx.app.emit('error', tokenExpiredError, ctx)
            case 'JsonWebTokenError':
                console.error('无效的token', error);
                return ctx.app.emit('error', invalidToken, ctx)
            default:
                break;
        }
    }
}


const hadAdminPermission = async(ctx, next) => {
    const { is_admin } = ctx.state.user

    console.log(ctx.state.user);

    if (!is_admin) {
        console.error('该用户没有管理员权限', ctx.state.user);
        return ctx.app.emit('error', hadNotAdminPermission, ctx)
    }

    next()
}

module.exports = {
    auth,
    hadAdminPermission
}