function hasToBeAdmin (req, res, next) {
    if (req.user && !req.user.is_admin) {
        res.status(401)
        res.send({
            message: 'You are not an administrator'
        })
        return
    }
    next()
}

module.exports = hasToBeAdmin