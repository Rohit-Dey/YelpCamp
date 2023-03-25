const User = require('../models/user')

module.exports.register = (req, res) => {
    res.render('users/register')
}

module.exports.newUser =  async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({
            email,
            username
        })
        const registeredUser = await User.register(user, password);
        //To directly login after registering
        req.login(registeredUser, (err) => {
            if(err) return next(err)
            req.flash('success', "Welcome to Yelp Camp")
            res.redirect('/campgrounds');
        }) 
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginPage = async (req, res) => {
    res.render('users/login')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome Back!');   
    const redirectURL = req.session.returnTo || '/campgrounds';
    res.redirect(redirectURL);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) return next(err);
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    });
}