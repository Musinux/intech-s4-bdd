const PostgresStore = require('../PostgresStore')

class Category {
    /** @type {Number} */
    id
    /** @type {String} */
    name

    /**
     * @param {String} name
     */
    static async create (name) {
        await PostgresStore.client.query({
            text: `INSERT INTO ${Category.tableName} (name) VALUES ($1)`,
            values: [name]
        })
    }

    static toSQLTable () {
        return `
            CREATE TABLE ${Category.tableName} (
                id SERIAL PRIMARY KEY,
                name TEXT
            )
        `
    }
}

/** @type {String} */
Category.tableName = 'category'

module.exports = Category