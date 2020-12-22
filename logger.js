function log(req, res, next) {
    console.log('Logging...');
    next();
}

function authenticate(req, res, next) {
    console.log('Authenticating...');
    next();
}

exports.auth = authenticate;
exports.logging = log;
