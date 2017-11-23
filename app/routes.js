module.exports = (app, passport) => {

    app.get('/', (req, res) => {
        res.render('index.ejs'); // load the index.ejs file
    })

    app.get('/login', (req, res) => {       
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))

    app.get('/signup', (req, res) => {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    })

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/',
    }))

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    
    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/profile',
        failureRedirect: '/',
    }))

    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile.ejs', {
            user : req.user
        })
    })

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
}


const isLoggedIn = (req, res, next) => {
    
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
    
        // if they aren't redirect them to the home page
        res.redirect('/');
    }