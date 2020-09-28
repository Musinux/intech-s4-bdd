const router = require('express').Router()
const User = require('../models/user.model')
const hasToBeAuthenticated = require('../middlewares/has-to-be-authenticated.middleware')
const bcrypt = require('bcrypt')

function shouldntBeAuthenticated (req, res, next) {
    if (req.session.userId) {
        res.status(401)
        res.send({
            message: 'You are already authenticated'
        })
        return
    }
    next()
}

router.get('/me', hasToBeAuthenticated, async (req, res) => {
    const user = await User.getById(req.session.userId)
    user.password = null // NE JAMAIS ENVOYER SON MDP À L'UTILISATEUR
    res.json(user)
})

router.post('/login', shouldntBeAuthenticated, async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findByEmail(email)

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401)
        res.send({
            message: 'Did not find any couple matching email and password'
        })
        return
    }

    req.session.userId = user.id
    user.password = null

    res.json(user) // SURTOUT SANS SON MOT DE PASSE !!!!!!
})

router.post('/logout', hasToBeAuthenticated, (req, res) => {
    req.session.destroy(() => {})
    res.json({ message: 'disconnected' })
})

module.exports = router