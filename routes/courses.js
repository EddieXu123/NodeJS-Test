const express = require('express');
// Return router OBJECT b/c you can't just reuse express() in different files
// You will then export the router at the end of the file
const router = express.Router(); 


// Global course array for this demo
const courses = [
    { id: 1, name: 'course1'},
    { id: 2, name: 'course2'},
    { id: 3, name: 'course3'}
];

router.get('/', (req, res) => {
    res.send(courses);
});

// Adding course to global courses array (handling HTTP POST request)
router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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
router.get('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;