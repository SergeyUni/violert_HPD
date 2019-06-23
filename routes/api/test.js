const express = require('express');
const testRoutes = express.Router();
const getApplicationPage = require('../../scrapy/test');
/**
 * @route GET api/hpd/
 * @desc Retrive all HPD data
 * @access Public
 */
testRoutes.route('/').get(function(req, res) {
    console.log('req body', req.query);
    let {city} = req.query;
    getApplicationPage(city)
        .then(data => {
            res.json({data});
        })
        .catch(error => {
            res.json({error});
        });
});

module.exports = testRoutes;