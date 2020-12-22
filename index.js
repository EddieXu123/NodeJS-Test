const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const Joi = require('joi'); // Joi class is returned (input validation package)
const logger = require('./logger'); // Middleware functions module
const express = require('express'); // import express modules
const app = express(); // app represents express object

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

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));

// Getting env variable (secret password)
console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    // Using another third-party middleware (look at documentation)
    app.use(morgan('tiny'));
    console.log('Morgan Enabled');
}


// Middleware with clean code (putting it in a separate module)
const logging = logger.logging;
const auth = logger.auth;

app.use(logging);
app.use(auth);

// Global course array for this demo
const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'}
];
// app.get();
// app.post();
// app.put();
// app.delete();

// First is the url, then the callback function
// Defining a route
app.get('/', (req, res) => {
    res.send("Hello World!!"); 
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// Adding course to global courses array (handling HTTP POST request)
app.post('/api/courses', (req, res) => {
    const schema = {
        name: Joi.string().min(3).required()
    };

    // Look into this: const result = Joi.validate(req.body, schema);
    // console.log(result);

    if (!req.body.name || req.body.name.length < 3) {
        // 400 = Bad Request
        res.status(400).send('Name is required and should be at least 3 characters');
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // Look up course
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // If not exist, return 404
    if (!course) res.status(404).send('The course with the given ID was not found');// 404
    
    // Validate the course
    // If invalid, return 404
    const schema = {
        name: Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body, schema);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    };

    // Update the course and return updated course to client
    course.name = req.body.name;
    res.send(course);
});

// Implementing a route to get a user
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given ID was not found');// 404
    res.send(course);
});

// Validation logic (can be used above)
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

app.delete('/api/courses/:id', (req, res) => {
    // Look up course with given ID
    // If not exist, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given ID was not found');// 404
    
    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    
    // Return the course that was deleted
    res.send(course);
});




// PORT
const port = process.env.PORT || 3000 // If 

// Now we need to listen to this request
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});





