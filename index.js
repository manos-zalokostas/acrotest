const express = require('express');
const cookie = require('cookie-parser')
const session = require('express-session');
const Swagger = require('./lib/swagger')
const loadRoutes = require('./routes');


require('dotenv').config();
require('./syncdb')();


const app = express()
const sessStore = new session.MemoryStore();
let [swaggerUi, swaggerDocs] = Swagger();


app.use(cookie())
app.use(express.raw());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(`/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(session({
    secret: process.env.ENV_SESSSEC,
    saveUninitialized: false,
    store: sessStore,
    resave: false,
}));


loadRoutes(app)


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('AN ERROR OCCURED.. ')
})


app.listen(process.env.ENV_APPPORT, () => {
    console.log(`APP READY AT  http://${process.env.ENV_APPDOM}:${process.env.ENV_APPPORT}`)
})


