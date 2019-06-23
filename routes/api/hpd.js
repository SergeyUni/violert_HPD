const express = require('express');
const hpdRoutes = express.Router();

/**
 * @route GET api/hpd/
 * @desc Retrive all HPD data
 * @access Public
 */
hpdRoutes.route('/').get(function(req, res) {
    res.json('This is api/hpd/');
});

module.exports = hpdRoutes;