'use strict'

var chalk = require('chalk');

var Customer = require('./customer.db');
var utils = require('../../utils/utils');

/**
 * ROUTE: PUT '/api/customers/fuzzy'
 */
exports.fuzzyQuery = function (req, res) {
  
  // Return quickly for no query
  if (!req.body.query) {
    return res.status(200).json([]);
  }
  
  Customer.getFuzzy(req.body.query)
  .then(function (customers) {
    res.status(200).json(customers);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}

/**
 * ROUTE: PUT '/api/customers/fuzzy/:colName'
 */
exports.fuzzyQueryBy = function (req, res) {
  Customer.getFuzzyBy(req.body.query, req.params.colName)
  .then(function (customers) {
    res.status(200).json(customers);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}


/**
 * ROUTE: POST '/api/customers'
 */
exports.create = function (req, res) {
  Customer.create(req.body)
  .then(function (customer) {
    res.status(200).json(customer);
  })
  .catch(function (err) {
    console.log(err);
    utils.handleError(res, err);
  });
}

/**
 * ROUTE: GET '/api/customers/merge'
 */
exports.merge = function (req, res) {
  Customer.merge()
  .then(function () {
    console.log('Manual customer merge finished');
    res.status(200).send('OK');
  })
  .catch(function (err) {
    console.log('Something went wrong with merging customers from BamboraDW.');
    console.log(err);
    res.status(500).send('Internal Error');
  })
}

/**
 * ROUTE: GET '/api/customers/local'
 */
exports.getLocal = function (req, res) {
  
  Customer.getLocal()
  .then(function (customers) {
    res.status(200).json(customers);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
  
}

/**
 * ROUTE: PUT '/api/customers/'
 */
exports.createOrUpdate = function (req, res) {
  Customer.createOrUpdate(req.body)
  .then(function (customer) {
    res.status(200).json(customer);
  })
  .catch(function (err) {
    utils.handleError(res, err);
  });
}