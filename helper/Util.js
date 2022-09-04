const ERRINVL = 'invalid input';

/**
 *
 */

module.exports = {


    /**
     *
     * @param val
     * @returns {boolean}
     */
    isString(val) {
        return typeof val === 'string';
    },


    /**
     *
     * @param val
     * @returns {boolean}
     */
    isNumber(val) {
        return typeof val === 'number';
    },


    /**
     *
     * @param val
     * @returns {boolean|boolean}
     */
    isArray(val) {
        return Array.isArray(val)
    },


    /**
     *
     * @param val
     * @returns {boolean|boolean}
     */
    isObject(val) {
        return val && typeof val === 'object' && !Array.isArray(val)
    },


    /**
     *
     * @param {*} strdate
     */
    isDate(strdate) {

        if (!(strdate && isString(strdate))) throw ERRINVL;

        let a = strdate.match(/^\d{4}-\d{1,2}-\d{1,2}$/);

        return a && !isNaN(new Date(a[0]));


    },


    /**
     *
     * @param a
     * @returns {boolean}
     */
    isArrayEmpty(a) {
        if (!this.isArray(a)) throw ERRINVL;
        return a.length < 1;
    },


    /**
     *
     * @param {*} keys
     * @param {*} data
     * @returns
     */
    objectifyEntries(keys = [], data = [[]]) {

        if (!(
            keys && !this.isArrayEmpty(keys)
            && data && !this.isArrayEmpty(data)
            && !this.isArrayEmpty(data[0])
        )) throw ERRINVL;

        let pack = [];

        data.map(
            group => {
                if (!(this.isArray(group) && group.length === keys.length)) throw ERRINVL;
                let o = {};
                group.forEach(
                    (value, i) => o[keys[i]] = value
                )
                pack.push(o)
            }
        );

        return pack;
    },


    /**
     *
     * @param int
     * @param max
     * @param min
     * @returns {boolean}
     */
    inRange(int, max, min = 1) {
        if (!(isFinite(int) && isFinite(max) && isFinite(min))) throw ERRINVL;

        return +int >= +min && +int <= +max;
    },


    /**
     *
     * @param x
     * @param args
     * @returns {boolean}
     */
    inArray(x, ...args) {
        if (isFinite(x)) x = +x;
        return args.includes(x)
    },


    /**
     *
     * @param x
     * @returns {boolean}
     */
    exists(x) {
        return x !== undefined
    },


    /**
     *
     * @param email
     * @returns {boolean}
     *
     * CITE W3C: https://www.regextester.com/97767
     */
    isEmail(email) {
        let isValid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);

        return isValid;
    },


    /**(
     *
     * @param pass
     * @returns {boolean|boolean}
     */
    isPassword(pass) {
        return pass.length > 5
            && pass.length < 50
            && /[a-z]/.test(pass)
            && /[A-Z]/.test(pass)
            && /[0-9]/.test(pass)
            && /[!@#$%^&*]/.test(pass)
    }


};
