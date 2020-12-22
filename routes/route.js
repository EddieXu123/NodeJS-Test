const express = require('express');
const route = express.Router();

// First is the url, then the callback function
// Defining a route
route.get('/', (req, res) => {
    res.render('index', { title: 'My Express App', message: 'Hello'}); // Using Pug
});

module.exports = route;