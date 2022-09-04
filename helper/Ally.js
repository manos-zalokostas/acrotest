const ERRINVL = 'invalid input';

// /**
//  *
//  * @param arg
//  * @returns {Promise<T>}
//  * @constructor
//  */
// const Fetcher = (arg) => fetch(arg).then(res => res.json());


/**
 *
 * @param props
 * @returns {*|string}
 * @constructor
 */
const Loadable = (props) => {
    if (!(props
        && typeof props === 'object'
        && !Array.isArray(props)
        && 'isLoading' in props
        && 'children' in props
        && 'loader' in props)) throw ERRINVL

    return !props.isLoading && props.children || props.loader && props.loader
}


/**
 *
 * @param o
 * @returns {string}
 * @constructor
 */
const UrlQuery = (o) => {
    if (typeof o !== 'object' || Array.isArray(o)) throw ERRINVL;
    return Object.entries(o).map(pack => pack.join('=')).join('&')
}


/**
 *
 * @param info
 * @param params
 * @param query
 * @returns {string}
 * @constructor
 */
const Endpoint = (info, params = null, query = null) => {

    if (!(Array.isArray(info) && info[1] && typeof info[1] === 'string' && info[1].startsWith("/"))) throw ERRINVL;
    if (params && !Array.isArray(params)) throw ERRINVL;
    if (query && typeof query !== 'object') throw ERRINVL;

    let [name, path] = info;
    let end = path;

    if (params) end += "/" + params.join('/');

    if (query) end += '?' + UrlQuery(query);

    return end;
};




/**
 *
 * @param path
 * @returns {`${string}/entity/${string}/Controller`}
 * @constructor
 */
const Controller = (path) => {

    // let parts = path.split('/');
    // path = parts.slice(2, 4).join('/')

    return `${process.cwd()}/entity/${path}/Controller`;

}


/**
 *
 * @param msg
 * @param cond
 * @param args
 * @returns {boolean}
 * @constructor
 */
const Assure = (msg, cond, ...args) => {
    const LOG = 1;
    const DBG = 1;
    try {

        if (!(msg && typeof msg === 'string')) throw ERRINVL

        if (!cond) {
            msg = 'ACRERR | ' + msg;
            console.log(msg + ' => XXX')
            throw msg;
        }

        DBG && console.log(` > ACRLOG | ${msg} :: OK!`);
        DBG && args && args.length && console.log('ARGS:: ', args);

        return true;

    } catch (err) {
        LOG && Logger(err, args);
        throw err;
    }
}


/**
 *
 * @param entries
 * @constructor
 */
const AssureMulti = (entries) => {
    entries.forEach(
        ([msg, cond]) => Assure(msg, cond)
    )
}


/**
 *
 * @param error
 * @param args
 * @constructor
 */
const Logger = (error, args = null) => {
    let stack, msg;

    if (typeof error === 'string') {
        error = new Error(error + " => XXX ");
        stack = error.stack.split('\n')[2].split('/').splice(6);
    } else stack = error.stack.split('\n')[1].split('/').splice(6);

    if ('ctx' in args) args.ctx = {
        url: args.ctx.req.url,
        params: args.ctx.params,
        query: args.ctx.query
    }

    msg = (new Date()).toISOString() + " | ";
    msg += error.message + `
     - ${stack.map(str => str.toUpperCase()).join(" > ")}`
    msg += `
     - ${args && JSON.stringify({args})}`;

    require('npmlog').error(msg);
}


/*

 */
module.exports = {
    Assure,
    AssureMulti,
    Controller,
    Endpoint,
    UrlQuery,
    Logger,
}
