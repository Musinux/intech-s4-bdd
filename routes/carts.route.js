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

async function injectCart (req, res, next) {
    req.cart = await Cart.getUserCurrentCart(req.session.userId)
    next()
}

const cartMW = [hasToBeAuthenticated, injectCart]

// doit vérifier que l'utilisateur n'a pas déjà un panier non validé
router.post('/cart', cartMW, async (req, res) => {
    if (!req.cart) {
        const cart = await Cart.create(req.session.userId)
        res.json(cart)
        return
    }
    res.status(401)
    res.send({
        message: 'You already have a cart'
    })
})

router.post('/cart/article', cartMW, async (req, res) => {
    const { articleId, quantity } = req.body
    if (quantity < 1) {
        res.status(400).json({ message: "You can't order 0 of an article" })
        return
    }
    // si le panier n'existe pas... créer le panier
    if (!req.cart) {
        req.cart = await Cart.create(req.session.userId)
    }
    // vérifier que les quantités sont correctes
    const article = await Article.getById(articleId)

    if (!article || article.stock < quantity) {
        res.status(404)
        res.json({
            message: "Either The article doesn't exist or not enough stock for the asked quantity"
        })
    }

    // si l'article avait déjà été ajouté, alors refuser de l'ajouter
    const articleCart = await ArticleCart.get(req.cart.id, articleId)
    if (articleCart) {
        res.status(401)
        res.json({
            message: 'The article was already added'
        })
        return
    }

    // ajouter l'élément au panier
    await ArticleCart.add(req.cart.id, articleId, quantity)
    // retourner ok
    res.json({
        message: 'OK'
    })
})

router.put('/cart/article/:articleId', cartMW, async (req, res) => {
    const articleId = Number(req.params.articleId)
    const { quantity } = req.body
    if (quantity < 1) {
        res.status(400).json({ message: "You can't order 0 of an article" })
        return
    }

    if (!req.cart) {
        res.status(404).send({ message: "Can't add to a non-existent cart" })
        return
    }

    const item = await ArticleCart.get(req.cart.id, articleId)

    if (!item) {
        res.status(404).send({ message: "Can't change quantity to inexistent article" })
        return
    }
    // vérifier que les quantités sont correctes
    const article = await Article.getById(articleId)

    if (!article || article.stock < quantity) {
        res.status(404).json({
            message: "Either The article doesn't exist or not enough stock for the asked quantity"
        })
        return
    }

    await ArticleCart.updateQuantity(req.cart.id, article.id, quantity)

    res.json({ message: 'OK' })
})

router.delete('/cart/article/:articleId', cartMW, async (req, res) => {
    // supprime l'article du panier
    const articleId = Number(req.params.articleId)

    if (!req.cart) {
        res.status(404).send({ message: "Can't access a non-existent cart" })
        return
    }

    const item = await ArticleCart.get(req.cart.id, articleId)

    if (!item) {
        res.status(404).send({ message: "Can't delete an inexistent article" })
        return
    }

    await ArticleCart.remove(req.cart.id, articleId)

    res.json({ message: 'OK' })
})

router.put('/cart/validate', cartMW, async (req, res) => {
    if (!req.cart) {
        res.status(404).send({ message: "Can't access a non-existent cart" })
        return
    }
    // doit vérifier que les quantités sont toujours en stock
    const articles = await ArticleCart.getAllForCart(req.cart.id)

    if (!articles.length) {
        res.status(401).send({ message: "Cart is empty" })
        return
    }

    for (const article of articles) {
        if (article.quantity > article.stock) {
            res.status(401).send({ message: "Quantity is > to the stock" })
            return
        }
    }

    await Article.validateCart(req.cart.id)

    await Cart.validate(req.cart.id)

    // doit également retirer ces quantités des stocks pour ne pas vendre deux fois les mêmes objets
    res.json({
        message: 'OK'
    })
})

router.get('/cart', cartMW, async (req, res) => {
    res.json(req.cart)
})

// doit vérifier que le cart n'a pas déjà été validé
// on ne peut pas supprimer une commande validée, sinon c'est la ruine
router.delete('/cart/:cartId', hasToBeAuthenticated, async (req, res) => {

})

module.exports = router