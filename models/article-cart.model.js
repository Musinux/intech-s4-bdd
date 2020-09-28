const Cart = require('./cart.model')
const Article = require('./article.model')
const PostgresStore = require('../PostgresStore')

class ArticleCart {
    /** @type {Number} */
    id
    /** @type {Number} */
    cart_id
    /** @type {Number} */
    article_id
    /** @type {Date} */
    creation_date
    /** @type {Number} */
    quantity

    /**
     * @param {Number} cartId
     */
    static async getAllForCart (cartId) {
        const result = await PostgresStore.client.query({
            text: `SELECT
                ac.article_id AS id,
                ac.quantity AS quantity,
                article.stock AS stock
            FROM ${ArticleCart.tableName} AS ac
            LEFT JOIN ${Article.tableName} AS article
                ON article.id = ac.article_id
            WHERE cart_id = $1
            `,
            values: [cartId]
        })
        return result.rows
    }

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
    static async get (cartId, articleId) {
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

    /**
     * @param {Number} cartId
     * @param {Number} articleId
     */
    static async remove (cartId, articleId) {
        await PostgresStore.client.query({
            text: `DELETE FROM ${ArticleCart.tableName}
            WHERE cart_id=$1 AND article_id=$2`,
            values: [cartId, articleId]
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