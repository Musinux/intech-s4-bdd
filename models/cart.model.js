const User = require('./user.model')
const PostgresStore = require('../PostgresStore')

class Cart {

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