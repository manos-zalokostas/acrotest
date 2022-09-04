const Api = {

    /**
     *
     * @param data
     * @param res
     */
    data: (data, res) => {
        try {
            res.status(200).json({data})
        } catch (error) {
            console.error(error)
        }
    },


    /**
     *
     * @param error
     * @param res
     */
    error: (error, res) => {
        try {
            res.status(404).json({error: error.stack || error});
        } catch (error) {
            console.error(error)
        }
    },


    /**
     *
     * @param feed
     * @param res
     */
    reply: (feed, res) => {
        'error' in feed
            ? Api.error(feed.error, res)
            : Api.data(feed.data, res)
    },


    // /**
    //  *
    //  * @param path
    //  * @param valid
    //  * @returns {boolean}
    //  */
    //  validatePath : (path, valid) => {
    //     if (!Object.keys(valid).includes(path)) throw 'INVALID REQUEST PATH';
    //     return true;
    // },


    // /**
    //  *
    //  * @param query
    //  * @param valid
    //  * @returns {boolean|*}
    //  */
    // validateParams: (query, valid) => {
    //     let Util = require('../helper/Util')
    //
    //     if (!Util.evalObjectEntries(query, valid)) throw 'INVALID REQUEST QUERY';
    //     return true;
    // },


    // /**
    //  *
    //  * @param path
    //  * @param query
    //  * @param valid
    //  * @returns {*}
    //  */
    //  validateRequest : (path, query, valid) => {
    //     return this.validatePath(path, valid) && this.validateQuery(query, valid)
    // }


};

module.exports = Api;
