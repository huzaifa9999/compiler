const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 12, 
    message: { output: 'Too many requests, please try again later.' },
}
);

module.exports = limiter;