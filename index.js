
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const regFactory = require('./registration_number');
const flash = require('express-flash');
const session = require('express-session');
const pg = require("pg");
const Pool = pg.Pool;
const _ = require('lodash');
const regApp = require("./routes");



const app = express();


const connectionString = process.env.DATABASE_URL || 'postgresql://bomkazi:codex@123@localhost:5432/registrations';

const pool = new Pool({
    connectionString
});

const regInstance = regFactory(pool);
const routeInst = regApp(regInstance)

app.engine('handlebars', exphbs({ defaultLayout: 'main', layoutsDir: 'views/layouts' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(session({
    secret: "fcsss",
    resave: false,
    saveUninitialized: true
}))

app.use(flash());
app.use(express.static('public'));

app.get('/', routeInst.home)

app.post('/reg_numbers', routeInst.post)

app.get('/reg_numbers', routeInst.filterBy)

app.get('/reset', routeInst.clearBtn)

const PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
    console.log("App started at port", PORT)
});


