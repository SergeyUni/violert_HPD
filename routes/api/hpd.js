const express = require('express');
const hpdRoutes = express.Router();
const startScraping = require('../../scrapy/hpd');
/**
 * @route GET api/hpd/
 * @desc Retrive all HPD data
 * @access Public
 */
hpdRoutes.route('/').get(function(req, res) {
    console.log('req body', req.query);
    let {house, street, boro} = req.query;
    startScraping(house, street, boro)
        .then(data => {
            res.json({data});
        })
        .catch(error => {
            res.json({error});
        });
});

module.exports = hpdRoutes;