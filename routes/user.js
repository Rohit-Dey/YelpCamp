const express = require('express');
const passport = require('passport');
const router = express.Router();
const users = require('../controllers/users')

router.route('/register')
    .get(users.register)
    .post(users.newUser)

router.route('/login')
    .get(users.loginPage)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo:true}), users.login)
                                                                                                    //keepSessionInfo to not erase the properties given by us
router.get('/logout', users.logout)

module.exports = router;