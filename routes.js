const {Controller, Endpoint, Logger} = require('./helper/Ally');
const Api = require("./helper/Api");
const Auth = require("./service/auth")();

const NO_LOGIN = 'NO_LOGIN';


/**
 *
 * @param app
 * @param kc
 */
module.exports = (app) => {

    app.post("/login", async (req, res) => route('submit', req, res))


    app.post("/register", async (req, res) => route('submit', req, res))


    /**
     * @swagger
     * /api/npa/scenarios:
     *      get:
     *          description: Generation and demand scenarios
     *          parameters:
     *              -   name: tdata
     *                  in: query
     *                  description: "Valid data types: 1 (demand) | 2 (generate)"
     *                  schema:
     *                      type: integer
     *              -   name: tday
     *                  in: query
     *                  description: "Valid day types: 1 (weekday) | 2 (weekend)"
     *                  schema:
     *                      type: integer
     *              -   name: storage
     *                  in: query
     *                  description: "Valid storage values: 5 | 10"
     *                  schema:
     *                      type: integer
     *              -   name: tday
     *                  in: query
     *                  description: "Valid growth values: 3 | 6"
     *                  schema:
     *                      type: integer
     *          responses:
     *              '200':
     *                  description: ' {"data": {"variation": [["autumn", 1.20854, 1.40919, 1.7849, 3.3649, 1], ...], "profile": [{"id": "autumn", "data": [{"x": 1, "y": 1.37232}, ...]}, ...]}} '
     *
     */
    app.get("/users", async (req, res) => adminRoute('list', req, res))
    app.get("/users/:id", async (req, res) => adminRoute('read', req, res))
    app.post("/users", async (req, res) => adminRoute('create', req, res))
    app.put("/users/:id", async (req, res) => adminRoute('update', req, res))
    app.delete("/users/:id", async (req, res) => adminRoute('delete', req, res))


    app.get("/tasks", async (req, res) => userRoute('list', req, res))
    app.get("/tasks/:id", async (req, res) => userRoute('read', req, res))
    app.post("/tasks", async (req, res) => userRoute('create', req, res))
    app.put("/tasks/:id", async (req, res) => userRoute('update', req, res))
    app.delete("/tasks/:id", async (req, res) => userRoute('delete', req, res))


    app.get("/logout", async (req, res) => userRoute('logout', req, res))

}


/**
 *
 * @param method
 * @param req
 * @param res
 * @param accessLevel
 * @returns {Promise<void>}
 */
const route = async (method, req, res, accessLevel = '') => {
    let user, path, controller, result, userProfile;
    try {


        if (method === 'logout') {

            Auth.deprecate(req, res)

            let data = {logout: true};

            return Api.reply({data}, res)
        }


        if (accessLevel) {

            userProfile = Auth.verify(req, res)

            if (!userProfile) throw 'LOGIN REQUIRED';

            if (accessLevel === 'host' && userProfile.role !== 'host') throw 'RESTRICTED AREA'

            req.userProfile = userProfile;
        }


        result = await _invokeController(method, req, res);


        return Api.reply(result, res)

    } catch (error) {
        Logger(error, {user, result, path: req.path})
        return Api.reply({error}, res, {controller, result})
    }
}


/**
 *
 * @param method
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const userRoute = (method, req, res) => route(method, req, res, 'user')


/**
 *
 * @param method
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const adminRoute = (method, req, res) => route(method, req, res, 'host')


/**
 *
 * @param method
 * @param req
 * @param res
 * @returns {Promise<*>}
 * @private
 */
const _invokeController = async (method, req, res) => {

    let path, controller, result;

    path = req.path.split("/")[1];
    controller = require(Controller(path))(req, res)

    result = await controller[method]();

    return result;

}
