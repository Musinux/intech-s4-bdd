const Cart = require('./cart.model')
const Article = require('./article.model')

class ArticleCart {
    static toSQLTable () {
        return `
            CREATE TABLE ${ArticleCart.tableName} (
                id SERIAL PRIMARY KEY,
                cart_id INTEGER REFERENCES ${Cart.tableName}(id),
                article_id INTEGER REFERENCES ${Article.tableName}(id),
                creation_date TIMESTAMPTZ,
                quantity INTEGER
            )
        `
    }
}

/** @type {String} */
ArticleCart.tableName = 'article_cart'

module.exports = ArticleCart