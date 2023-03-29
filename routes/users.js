const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');

//Redirecting to register form 
router.get('/register' , users.renderRegister);
//registering new user
router.post('/register' ,catchAsync(users.register))
//login 
router.get('/login' ,users.renderLogin)
//passport.authenticate() is a middleware by passport which  can be used for various login type
router.post('/login' ,passport.authenticate('local' ,{failureFlash:true , failureRedirect:'/login'}),users.login)
//logout from the website
router.get('/logout',users.logout)

module.exports = router;
