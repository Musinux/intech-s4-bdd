const Cart = require('./cart.model')
const Article = require('./article.model')
const PostgresStore = require('../PostgresStore')

class ArticleCart {

    /**
     * @param {Number} cartId
     * @param {Number} articleId
     * @param {Number} quantity
     */
    static async updateQuantity (cartId, articleId, quantity) {
        await PostgresStore.client.query({
            text: `UPDATE ${ArticleCart.tableName}
            SET quantity=$3
            WHERE cart_id=$1 AND article_id=$2
            RETURNING *`,
            values: [cartId, articleId, quantity]
        })
    }

    /**
     * @param {Number} cartId
     * @param {Number} articleId
     */
    static async getByCartAndArticle (cartId, articleId) {
        const result = await PostgresStore.client.query({
            text: `SELECT * FROM ${ArticleCart.tableName}
            WHERE cart_id=$1 AND article_id=$2`,
            values: [cartId, articleId]
        })

        return result.rows[0]
    }

    /**
     * @param {Number} cartId
     * @param {Number} articleId
     * @param {Number} quantity
     */
    static async add (cartId, articleId, quantity) {
        await PostgresStore.client.query({
            text: `INSERT INTO ${ArticleCart.tableName}
            (cart_id, article_id, creation_date, quantity)
            VALUES ($1, $2, $3, $4)`,
            values: [cartId, articleId, new Date(), quantity]
        })
    }

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