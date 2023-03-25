

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash')
const User = require('./models/user')
const passport = require('passport');
const LocalStrategy = require('passport-local')

const MongoDBStore = require("connect-mongo")(session);

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user')
const dbUrl = process.env.db_URL || 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database Connected")
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true })) //to view req.body otherwise it is empty by default
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    secret: 'thisisnotagoodsecret',
    resave: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!['/login', '/', '/register', '/favicon.ico].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    console.log(req.session)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Not Right"
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving On Port 3000')
})
