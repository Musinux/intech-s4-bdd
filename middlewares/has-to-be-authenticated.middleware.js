function hasToBeAuthenticated (req, res, next) {
    if (!req.session.userId) {
        res.status(401)
        res.send({
            message: 'You are not authenticated'
        })
        return
    }
    next()
}

module.exports = hasToBeAuthenticated