const User = require('../model/use.model')

class UserService {
    async createUser(user_name, password) {
        //插入数据
        console.log(user_name, password);
        let res = await User.create({ user_name, password })
        console.log(res);
        return res
    }
}

module.exports = new UserService()