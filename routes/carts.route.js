const router = require('express').Router()
const Article = require('../models/article.model')

// ne retourne que les paniers liés à l'utilisateur en cours
router.get('/carts', async (req, res) => {

})

// doit vérifier que l'utilisateur n'a pas déjà un panier non validé
router.post('/cart', async (req, res) => {

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