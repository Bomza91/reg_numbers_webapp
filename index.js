const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const regFactory = require('./registration_number');
const flash = require('express-flash');
const session = require('express-session');
const pg = require("pg");
const Pool = pg.Pool;
const _ = require('lodash');


const app = express();


const connectionString = process.env.DATABASE_URL || 'postgresql://bomkazi:codex@123@localhost:5432/registrations';

const pool = new Pool({
    connectionString
});

const regInstance = regFactory(pool);

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

app.get('/', async function (req, res) {


    const plates = await regInstance.getReg()
    res.render('index', {
        plate: plates

    })
});

app.post('/reg_numbers', async function (req, res) {
    var reg = _.upperCase(req.body.regNumberEntered);
    var duplicate = await regInstance.checkingReg(reg)

    if (!reg) {
        req.flash('info', 'Please enter your registration number');
    }

    else if (duplicate !== 0) {
        req.flash('info', 'registration already exist')
    }

    else if (!(/C[AKJ]\s\d{3}-\d{3}$|C[AKJ]\s\d{3}$|C[AKJ]\s\d{3} \d{3}$/.test(reg))) {
        req.flash('error', 'Enter a correct registration number');
    }
   
    else {
        await regInstance.regNumber(reg)
        req.flash('success', 'You have entered a correct registration number')
    }


    const plates = await regInstance.getReg()
    res.render('index', {
        plate: plates

    })

});

app.get('/reg_numbers', async function (req, res) {

    let area = req.query.town
    console.log(area);

    if (!area) {
        req.flash('info', 'Please select a town');
    } else {
        const filtering = await regInstance.showFilter(area)

        res.render('index', {
            plate: filtering
        })
    }
});

app.get('/reset', async function (req, res) {

    await regInstance.reset()
    res.render('index');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, function () {
    console.log("App started at port", PORT)
});








``





