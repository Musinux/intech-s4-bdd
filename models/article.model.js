const Category = require('./category.model')
const PostgresStore = require('../PostgresStore')

class Article {
    /** @type {Number} */
    id
    /** @type {String} */
    title
    /** @type {String} */
    description
    /** @type {Number} */
    stock
    /** @type {Number} */
    price
    /** @type {Number} */
    category_id

    /**
     * @param {Article} article
     */
    static async create (article) {
        const result = await PostgresStore.client.query({
            text: `INSERT INTO ${Article.tableName}
                   (title, description, stock, price, category_id)
            VALUES ($1,    $2,          $3,    $4,    $5)
            RETURNING *`,
            values: [article.title, article.description, article.stock, article.price, article.category_id]
        })
        return result.rows[0]
    }


    /**
     * @param {Number} articleId
     * @param {Article} article
     */
    static async update (articleId, article) {
        const result = await PostgresStore.client.query({
            text: `UPDATE ${Article.tableName}
            SET title=$2, description=$3, stock=$4, price=$5, category_id=$6
            WHERE id=$1
            RETURNING *`,
            values: [articleId, article.title, article.description, article.stock, article.price, article.category_id]
        })
        return result.rows[0]
    }

    /**
     * @returns {Promise<Article[]>}
     */
    static async getAll () {
        const result = await PostgresStore.client.query({
            text: `SELECT * FROM ${Article.tableName}`
        })
        return result.rows
    }

    /**
     * @param {Number} articleId
     * @returns {Promise<Article>}
     */
    static async getById (articleId) {
        const result = await PostgresStore.client.query({
            text: `SELECT * FROM ${Article.tableName} WHERE id=$1`,
            values: [articleId]
        })
        return result.rows[0]
    }

    /**
     * @param {Number} articleId
     */
    static async delete (articleId) {
        await PostgresStore.client.query({
            text: `DELETE FROM ${Article.tableName} WHERE id=$1`,
            values: [articleId]
        })
    }

    static toSQLTable () {
        return `
            CREATE TABLE ${Article.tableName} (
                id SERIAL PRIMARY KEY,
                title TEXT,
                description TEXT,
                stock INTEGER,
                price DECIMAL,
                category_id INTEGER REFERENCES ${Category.tableName}(id)
            )
        `
    }
}

/** @type {String} */
Article.tableName = 'article'

module.exports = Article