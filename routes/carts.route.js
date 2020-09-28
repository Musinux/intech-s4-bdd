const router = require('express').Router()
const Cart = require('../models/cart.model')
const hasToBeAuthenticated = require('../middlewares/has-to-be-authenticated.middleware')
const Article = require('../models/article.model')
const ArticleCart = require('../models/article-cart.model')

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

router.post('/cart/article', hasToBeAuthenticated, async (req, res) => {
    const { articleId, quantity } = req.body
    // récupérer le panier en cours
    let cart = await Cart.getUserCurrentCart(req.session.userId)
    // si le panier n'existe pas... créer le panier
    if (!cart) {
        cart = await Cart.create(req.session.userId)
    }
    // vérifier que les quantités sont correctes
    const article = await Article.getById(articleId)

    if (!article || article.stock < quantity || quantity < 0) {
        res.status(404)
        res.json({
            message: "Either The article doesn't exist or not enough stock for the asked quantity"
        })
    }

    // si l'article avait déjà été ajouté, alors refuser de l'ajouter
    const articleCart = await ArticleCart.getByCartAndArticle(cart.id, articleId)
    if (articleCart) {
        res.status(401)
        res.json({
            message: 'The article was already added'
        })
        return
    }

    // ajouter l'élément au panier
    await ArticleCart.add(cart.id, articleId, quantity)
    // retourner ok
    res.json({
        message: 'OK'
    })
})

router.put('/cart/article/:articleId', hasToBeAuthenticated, async (req, res) => {
    const articleId = Number(req.params.articleId)
    const { quantity } = req.body
    let cart = await Cart.getUserCurrentCart(req.session.userId)
    if (!cart) {
        res.status(404)
        res.send({
            message: "Can't add to a non-existent cart"
        })
        return
    }

    const item = await ArticleCart.getByCartAndArticle(cart.id, articleId)

    if (!item) {
        res.status(404)
        res.send({
            message: "Can't change quantity to inexistent article"
        })
        return
    }
    // vérifier que les quantités sont correctes
    const article = await Article.getById(articleId)

    if (!article || article.stock < quantity || quantity < 0) {
        res.status(404)
        res.json({
            message: "Either The article doesn't exist or not enough stock for the asked quantity"
        })
    }

    await ArticleCart.updateQuantity(cart.id, article.id, quantity)

    res.json({
        message: 'OK'
    })
    // changement de quantités d'un article donné
    // vérifier si on avait bien l'article dans le panier, sinon stop
    // vérifier qu'on a assez de stock
    // puis changer la quantité de l'article dans le panier
})

router.get('/cart/:cartId', hasToBeAuthenticated, async (req, res) => {

})

// doit vérifier que le cart n'a pas déjà été validé
// on ne peut pas supprimer une commande validée, sinon c'est la ruine
router.delete('/cart/:cartId', hasToBeAuthenticated, async (req, res) => {

})

module.exports = router