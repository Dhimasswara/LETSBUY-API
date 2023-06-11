require('dotenv').config()
const express = require('express');
const createError = require('http-errors')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require("helmet")
const xss = require('helmet')
const app = express();
const port = process.env.PORT;
const mainRouter = require('./src/routes/index')

// body parse express 
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(
    cors({
      origin: ['https://hirejob-kappa.vercel.app', 'http://localhost:3000'],
      credentials: true,
      methods: "GET, POST, PUT, DELETE",
    })
  );
app.use(morgan('dev'));


// router utama
// app.post('/product/', (req, res) => {
//     console.log(req);
// })
app.use('/', mainRouter);

app.use(helmet());
app.use(xss());
app.use('/img', express.static('src/upload'))
app.all('*', (req, res, next) => {
    next(new createError.NotFound())
})

app.use((err, req, res, next) => {
    const messageError = err.message || "internal server error"
    const statusCode = err.status || 500

    res.status(statusCode).json({
        message: messageError
    })

    next()
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})
