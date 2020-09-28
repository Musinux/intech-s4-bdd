const User = require('../models/user.model')

async function injectUser (req, res, next) {
    if (req.session.userId) {
        req.user = await User.getById(req.session.userId)
    }
    next()
}

module.exports = injectUser