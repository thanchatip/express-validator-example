const express = require('express');
const bodyParser = require('body-parser');
const port = 3000

const {
    check,
    validationResult
} = require('express-validator');

const app = express();

let myValidators = [
    check('username')
        .isLength({ min: 1 }).withMessage('Login is a required field.')
        .isAlphanumeric().withMessage('Login must be alphanumeric.'),

    check('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters in length.')
        .matches('\[0-9\]').withMessage('Password must contain at least 1 number.')
        .matches('\[a-z\]').withMessage('Password must contain at least 1 lowercase letter.')
        .matches('\[A-Z\]').withMessage('Password must contain at least 1 uppercase letter.')
        .custom((value, { req, loc, path }) => {
            if (value !== req.body.confirmPassword) {
                return false;
            } else {
                return value;
            }
        }).withMessage("Passwords don't match."),
]

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('hello')
})

app.post('/user', myValidators ,function (req, res) {
    const errors = validationResult(req);
    console.log('your req', req.body);
    if (!errors.isEmpty()) {
        return res.status(422).json({
                    errors: errors.array()});
    } else {
        res.status(200).json({
            errors: 'create user success'
        })
}})

app.post('/validateUser', [
    // check username must be at least 1 chars
    check('username').isLength({ min: 1, max: 10 }).withMessage('must be at least 1-10 chars'),
    check('email').isEmail(),
    check('password').isLength({ min: 8 }).withMessage('must be at least 8 chars long')
        .matches('[0-9]').withMessage('must contain number and alphabet')
        .matches('[a-z]').withMessage('must contain number and alphabet')
    ], function (req, res) {
        const errors = validationResult(req);
        console.log('your req', req.body);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        } else {
            res.status(200).json({ errors: 'create user success' })
        }
    }
)

app.post('/test', function (req, res) {
    console.log(req)
    return res.status(200).json({
        errors: req.body
    });
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

module.exports = app;