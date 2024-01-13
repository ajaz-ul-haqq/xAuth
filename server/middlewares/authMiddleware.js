class AuthMiddleware
{
    isLoggedIn(req, res, next) {
        if(!req.headers['x-auth']) {
            res.json({'status' : true, 'message' : 'Oops!!... you must login first', 'code' : 401})
            return;
        }
        next()
    }

    logReq(req, res, next) {
        console.log('Middleware....')
        next()
    }

    logReq2(req, res, next) {
        console.log('Middleware next ....')
        next()
    }
}


module.exports = AuthMiddleware;