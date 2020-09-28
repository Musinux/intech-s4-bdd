const PostgresStore = require('./PostgresStore')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const injectUser = require('./middlewares/inject-user.middleware')

PostgresStore.init()
.then(() => console.log('connected'))

const app = express();

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
    secret: 'sU2{fR7#qA7*gB9(qR2_yR4.r',
    resave: false,
    saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use(injectUser)

const articlesRouter = require('./routes/articles.route')
const authRouter = require('./routes/auth.route')
const cartsRouter = require('./routes/carts.route')

app.use('/api', authRouter)
app.use('/api', articlesRouter)
app.use('/api', cartsRouter)

module.exports = app;
