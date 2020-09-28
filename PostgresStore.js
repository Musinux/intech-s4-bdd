const pg = require('pg')
const config = require('./server.config.js')

class PostgresStore {
    /** @type {pg.Client} **/
    client;

    async init () {
        this.client = new pg.Client(config.postgres)

        await this.client.connect()
    }
}

module.exports = new PostgresStore()