const router = require('express').Router()
const Cart = require('../models/cart.model')
const hasToBeAuthenticated = require('../middlewares/has-to-be-authenticated.middleware')

// router.use(hasToBeAuthenticated)

// ne retourne que les paniers liés à l'utilisateur en cours
router.get('/carts', hasToBeAuthenticated, async (req, res) => {
    const carts = await Cart.getByUserId(req.session.userId)
    res.json(carts)
})

// doit vérifier que l'utilisateur n'a pas déjà un panier non validé
router.post('/cart', hasToBeAuthenticated, async (req, res) => {
    const hasCart = await Cart.getUserCurrentCart(req.session.userId)
    if (!hasCart) {
        const cart = await Cart.create(req.session.userId)
        res.json(cart)
        return
    }
    res.status(401)
    res.send({
        message: 'You already have a cart'
    })
})

// doit vérifier que l'utilisateur a déjà un panier
router.put('/cart/:cartId', hasToBeAuthenticated, async (req, res) => {

})

router.get('/cart/:cartId', hasToBeAuthenticated, async (req, res) => {

})

// doit vérifier que le cart n'a pas déjà été validé
// on ne peut pas supprimer une commande validée, sinon c'est la ruine
router.delete('/cart/:cartId', hasToBeAuthenticated, async (req, res) => {

})

module.exports = router