const express = require("express");
const morgan = require("morgan")
const cors = require("cors")
const multer = require('multer');
const upload = multer();
require("dotenv").config()

const app =  express();
app.use(morgan('dev'))
app.use(cors({origin : true, credentials : true}))

const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const models = require('./models')

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


app.post('/init', [upload.none(), (req, res) => {
    res.json({
        'success' : true,
        'message' : 'Form submitted successfully!',
        'data' : req.body
    });
}]);
app.use('/api/auth', authRoutes);

app.use('/api/admin', [isAdmin, adminRoutes])

app.all('*', function (req, res) {
    res.json({
        'status' : false,
        'code' : 404,
        'message' : 'Invalid Api Endpoint'
    })
})

const port = process.env.PORT || 9801;

app.listen(port, () => {
    console.log(`Server is running on : ${port}`);
})