'use strict';

const SQLite = require('better-sqlite3');

/**
 * @class The Database
 */
class Database {
    constructor(options = {}) {

        /**
         * The name of the database
         * @type {string}
         */
        this.name = options.name || 'endb';

        /**
         * Whether or not, use the memory for database
         * @type {boolean}
         */
        this.memory = Boolean(options.memory) || false;

        /**
         * The timeout for the database
         * @type {number}
         */
        this.timeout = typeof options.timeout === 'number' ? options.timeout : 5000;

        /**
         * The SQLite connection of the database
         * @type {SQLite}
         */
        this.db = new SQLite('database.sqlite', {
            memory: this.memory,
            timeout: this.timeout
        });

        this.validateOptions(options);
    }

    /**
     * Gets the number of rows in the database
     * @returns {number}
     */
    get count() {
        const data = this.db.prepare(`SELECT count(*) FROM '${this.name}'`).get();
        return data['count(*)'];
    }

    /**
     * Gets all the indexes (keys) from the database
     * @returns {Array<string>}
     */
    get indexes() {
        const rows = this.db.prepare(`SELECT key FROM '${this.name}'`).all();
        return rows.map((row) => row.key);
    }

    /**
     * Creates a backup of the database
     * @param {string} name
     */
    backup(name = `backup-${Date.now()}`) {
        if (name && typeof name !== 'string') throw new TypeError('Name must be a string');
        return this.db.backup(`${name}.sqlite`);
    }

    /**
     * Checks if the table exists in the database
     * @returns {*}
     */
    check() {
        this.db.prepare(`CREATE TABLE IF NOT EXISTS ${this.name} (key TEXT PRIMARY KEY, value TEXT)`).run();
    }

    /**
     * Deletes a key from the database
     * @param {string|number} key
     * @returns {boolean}
     */
    delete(key) {
        this.check();
        this.db.prepare(`DELETE FROM ${this.name} WHERE key = '${key}'`).run();
        return true;
    }

    /**
     * Deletes all the keys from the database
     * @returns {boolean}
     */
    deleteAll() {
        this.check();
        this.db.prepare(`DELETE FROM ${this.name};`).run();
        return true;
    }

    /**
     * Gets the specified key from the database, if exists
     * @param {string|number} key
     * @returns {string|number|Object}
     */
    get(key) {
        this.check();
        const data = this.db.prepare(`SELECT * FROM ${this.name} WHERE key = (?)`).get(key);
        if (!data) return null;
        try {
            data.value = JSON.parse(data.value);
        } catch (err) {
            data.value;
        }
        return data.value;
    }

    /**
     * Gets all the keys and values from the database
     * @returns {Array<Object>}
     */
    getAll() {
        this.check();
        const rows = this.db.prepare(`SELECT * FROM ${this.name} WHERE key IS NOT NULL`).all();
        return rows;
    }

    /**
     * Whether or not, specified key exists
     * @param {string|number} key
     * @returns {boolean}
     */
    has(key) {
        this.check();
        const data = this.db.prepare(`SELECT * FROM ${this.name} WHERE key = (?)`).get(key);
        return data ? true : false;
    }

    /**
     * Sets a key and value to the database
     * @param {string|number} key
     * @param {string|number|Object} value
     * @returns {Object}
     */
    set(key, value) {
        this.check();
        if (!key || !value) throw new TypeError('No key and value supplied');
        value = typeof value === 'object' ? JSON.stringify(value) : value;
        this.db.prepare(`INSERT INTO ${this.name} (key,value) VALUES (?,?)`).run(key, value);
        return {
            key,
            value
        };
    }

    /**
     * Validates the database options
     * @param {DatabaseOptions} options
     */
    validateOptions(options) {
        if (options.name && typeof options.name !== 'string') {
            throw new TypeError('Database name must be a string');
        }
        if (options.memory && typeof options.memory !== 'boolean') {
            throw new TypeError('The option "memory" must be a boolean');
        }
    }
}

module.exports = Database;