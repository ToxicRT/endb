'use strict';

const Error = require('./Error');

class Util {
    constructor() {
        throw new Error(`${this.constructor.name} may not be initiated`);
    }

    static test() {
        return 'hello world';
    }

    /**
     * Merges an object's property to other object
     * @param {Object} defObj Object with fefault properties
     * @param {Object} givenObj Object to assign default properties to
     * @returns {Object}
     */
    static mergeObject(defObj, givenObj) {
        if (!givenObj) return defObj;
        for (const key in defObj) {
            if (!Object.prototype.hasOwnProperty.call(givenObj, defObj) || givenObj[key] === undefined) {
                givenObj[key] = defObj[key];
            } else if (givenObj[key] === Object(givenObj[key])) {
                givenObj[key] = Util.mergeObject(defObj[key], givenObj[key]);
            }
        }
        return givenObj;
    }
}

module.exports = Util;