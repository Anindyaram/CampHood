const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

router.get('/register' , (req,res)=>{
    res.render('users/register');
})

router.post('/register' ,catchAsync(async(req ,res)=>{
    try{
    const{ email , username , password} = req.body;
    const user = new User({email , username});
    const registeredUser = await User.register(user , password);
    req.login(registeredUser, err=>{
        if(err) return next(err);
        req.flash('success','Welcome to CampHood!!');
        res.redirect('/campgrounds')
    })
    }catch(e){
        req.flash('error' ,e.message);
        res.redirect('register');
    }
}))

//login 
router.get('/login' ,(req,res)=>{
    res.render('users/login');
})
//passport.authenticate() is a middleware by passport which  can be used for various login type
router.post('/login' ,passport.authenticate('local' ,{failureFlash:true , failureRedirect:'/login'}),(req,res)=>{
    //If we get here it means user is authenticated successfully
    req.flash('success' ,'Welcome Back!!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);

})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','GoodBye!!');
    res.redirect('/campgrounds');
})

module.exports = router;
