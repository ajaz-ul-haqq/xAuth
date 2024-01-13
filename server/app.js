const express = require("express");
const mysql = require("mysql2")
const morgan = require("morgan")
const cors = require("cors")
const app =  express();
const models = require('./models')

require("dotenv").config()

// Middlewares

// Routes

app.use(morgan('dev'))
app.use(cors({origin : true, credentials : true}))
app.use(express.urlencoded({ extended: false }));

const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')

async function isAdmin(req, res, next) {
    if(!req.headers['x-auth']) {
        res.json({'status' : true, 'message' : 'Oops!!... you must login first', 'code' : 401})
        return;
    }

    const token = await models.oauthTokens().where('access_token', req.headers['x-auth']).first();

    if (token) {
        const user = await models.users().where('id', token.user_id).first();

        if (user && user.email === 'auhk.me@gmail.com') {
           next();
        } else {
            res.json({'status' : true, 'message' : 'Oops!!... you are not an admin', 'code' : 412})
        }

    } else {
        res.json({'status' : true, 'message' : 'Oops!!... you must login first', 'code' : 401})
    }
}

app.use('/api/auth', authRoutes);

app.use('/api/admin', [isAdmin, adminRoutes])


/**
 * if upto this moment no route is matched, its time for frontend;
 */

app.all('*', function (req, res) {
    res.json({
        'status' : false,
        'code' : 404,
        'message' : 'Invalid Api Endpoint'
    })
})

// Server

const port = process.env.PORT || 9801;

app.listen(port, () => {
    console.log(`Server is running on : ${port}`);
})