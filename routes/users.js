const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)//Redirecting to register form 
    .post(catchAsync(users.register))//registering new user

router.route('/login')
    .get(users.renderLogin)//login 
    .post(passport.authenticate('local' ,//authenticate is a middleware by passport which can be used for various login type
    {failureFlash:true ,failureRedirect:'/login'}),
    users.login)

router.get('/logout',users.logout)//logout from the website

module.exports = router;
