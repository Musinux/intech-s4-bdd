const router = require('express').Router()
const Cart = require('../models/cart.model')
const hasToBeAuthenticated = require('../middlewares/has-to-be-authenticated.middleware')

router.use(hasToBeAuthenticated)

// ne retourne que les paniers liés à l'utilisateur en cours
router.get('/carts', async (req, res) => {
    const carts = await Cart.getByUserId(req.session.userId)
    res.json(carts)
})

// doit vérifier que l'utilisateur n'a pas déjà un panier non validé
router.post('/cart', async (req, res) => {
    const hasCart = await Cart.getUserCurrentCart(req.session.userId)
    
})

// doit vérifier que l'utilisateur a déjà un panier
router.put('/cart/:cartId', async (req, res) => {

})

router.get('/cart/:cartId', async (req, res) => {

})

// doit vérifier que le cart n'a pas déjà été validé
// on ne peut pas supprimer une commande validée, sinon c'est la ruine
router.delete('/cart/:cartId', async (req, res) => {

})

module.exports = router