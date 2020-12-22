const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');

// Debuggers
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

const Joi = require('joi'); // Joi class is returned (input validation package)
const logger = require('./logger'); // Middleware functions module

const courses = require('./routes/courses')
const route = require('./routes/route');

const express = require('express'); // import express modules
const app = express(); // app represents express object

// Templating Engines
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware to parse JSON
app.use(express.json()); 

// Middleware that allows you to pass arrays and 
// complex objects using the urlencoded format: key=value & key=value. 
app.use(express.urlencoded( { extended: true })); 

// Allows you to read the static text in public directory
// When checking, you don't need the public in url: localhost:3000/readme.txt
app.use(express.static('public'));

// Using third-party middleware (someone else made)
app.use(helmet());

// For any route that starts with /api/courses, use the router we loaded from courses.js
app.use('/api/courses', courses);
// For any route with /, we load the route.js module
app.use('/', route);

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));

// Getting env variable (secret password)
console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    // Using another third-party middleware (look at documentation)
    app.use(morgan('tiny'));
    startupDebugger('Morgan Enabled...');
}

// Db work...
dbDebugger('Connected to the database...');

// Middleware with clean code (putting it in a separate module)
const logging = logger.logging;
const auth = logger.auth;

app.use(logging);
app.use(auth);

// app.get();
// app.post();
// app.put();
// app.delete();



// PORT
const port = process.env.PORT || 3000 // If 

// Now we need to listen to this request
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});





