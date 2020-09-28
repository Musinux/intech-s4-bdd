const router = require('express').Router()
const Article = require('../models/article.model')
const hasToBeAdmin = require('../middlewares/has-to-be-admin.middleware')

router.get('/articles', async (req, res) => {
    const articles = await Article.getAll()
    res.json(articles)
})

router.get('/article/:articleId', async (req, res) => {
    const articleId = Number(req.params.articleId)
    const article = await Article.getById(articleId)
    res.json(article)
})

// router.use(hasToBeAdmin)

router.post('/article', hasToBeAdmin, async (req, res) => {
    try {
        const article = await Article.create(req.body)
        res.json(article)
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

router.put('/article/:articleId', hasToBeAdmin, async (req, res) => {
    const articleId = Number(req.params.articleId)
    const article = await Article.update(articleId, req.body)
    res.json(article)
})

router.delete('/article/:articleId', hasToBeAdmin, async (req, res) => {
    try {
        const articleId = Number(req.params.articleId)
        await Article.delete(articleId)
        res.json({ message: 'ok' })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
})

module.exports = router