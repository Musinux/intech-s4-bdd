const User = require('./user.model')

class Cart {
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