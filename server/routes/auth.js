const express = require('express');

const router = express.Router();

const AuthController = require('../controllers/AuthController')

const AuthMiddleware = require("../middlewares/authMiddleware");

const auth = new AuthController();

const middleware = new AuthMiddleware();

router.get('/info', [middleware.logReq, middleware.logReq2, middleware.isLoggedIn, auth.getAuthInfo])

router.post('/login', [middleware.logReq, auth.postLogin])

router.get('/logout', [middleware.isLoggedIn, auth.postLogout])

module.exports = router;