const User = require('./user.model')
const PostgresStore = require('../PostgresStore')

class Cart {
    /** @type {Number} */
    id
    /** @type {Number} */
    user_id
    /** @type {Date} */
    creation_date
    /** @type {Boolean} */
    validated


    /**
     * @param {Number} userId
     * @returns {Promise<Cart>}
     */
    static async create (userId) {
        const result = await PostgresStore.client.query({
            text: `
            INSERT INTO ${Cart.tableName} 
                   (user_id, creation_date, validated)
            VALUES ($1,      $2,            FALSE)
            RETURNING *`,
            values: [userId, new Date()]
        })
        return result.rows[0]
    }

    /**
     * @param {Number} userId
     * @returns {Promise<Cart[]>}
     */
    static async getByUserId (userId) {
        const result = await PostgresStore.client.query({
            text: `SELECT * FROM ${Cart.tableName}
            WHERE user_id=$1`,
            values: [userId]
        })
        return result.rows
    }

    /**
     * @param {Number} userId
     * @returns {Promise<Cart>}
     */
    static async getUserCurrentCart (userId) {
        const result = await PostgresStore.client.query({
            text: `SELECT * FROM ${Cart.tableName}
            WHERE user_id=$1 AND validated=FALSE`,
            values: [userId]
        })
        if (result.rows.length === 0) {
            return null
        }
        return result.rows[0]
    }

    static toSQLTable () {
        return `
            CREATE TABLE ${Cart.tableName} (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES ${User.tableName}(id),
                creation_date TIMESTAMPTZ,
                validated BOOLEAN
            )
        `
    }
}

/** @type {String} */
Cart.tableName = 'cart'

module.exports = Cart