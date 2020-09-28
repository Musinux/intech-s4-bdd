const PostgresStore = require("../PostgresStore")

class User {
    /** @type {Number} */
    id
    /** @type {String} */
    firstname
    /** @type {String} */
    lastname
    /** @type {String} */
    password
    /** @type {String} */
    email
    /** @type {Boolean} */
    is_admin

    /**
     * @param {Number} userId
     * @returns {Promise<User>}
     */
    static async getById (userId) {
        const result = await PostgresStore.client.query({
            text: `SELECT * FROM ${User.tableName}
            WHERE id=$1`,
            values: [userId]
        })
        return result.rows[0]
    }

    /**
     * @param {String} email
     * @param {String} password
     * @returns {Promise<User>}
     */
    static async findByEmailAndPassword (email, password) {
        const result = await PostgresStore.client.query({
            text: `SELECT * FROM ${User.tableName}
            WHERE email=$1 AND password=$2`,
            values: [email, password]
        })
        return result.rows[0]
    }

    /**
     * @param {User} user
     */
    static async create (user) {
        await PostgresStore.client.query({
            text: `
            INSERT INTO ${User.tableName} 
                   (firstname, lastname, email, password, is_admin)
            VALUES ($1,        $2,       $3,    $4,       $5)`,
            values: [user.firstname, user.lastname, user.email, user.password, user.is_admin]
        })
    }

    static toSQLTable () {
        return `
            CREATE TABLE ${User.tableName} (
                id SERIAL PRIMARY KEY,
                firstname TEXT,
                lastname TEXT,
                password VARCHAR(60),
                is_admin BOOLEAN,
                email TEXT UNIQUE
            )
        `
    }
}

/* Pour faire une référence:
    user_id INTEGER REFERENCES ${User.tableName}(id),
*/

/** @type {String} */
User.tableName = 'users'

module.exports = User