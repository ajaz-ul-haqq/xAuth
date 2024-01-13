const express = require('express');

const router = express.Router();

const models = require('../models');

router.get('/tokens', async function (req, res){
    res.json(
        await models.oauthTokens().get()
    )
})

module.exports = router;