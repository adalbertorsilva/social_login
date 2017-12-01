
module.exports = (app, passport) => {
  app.get('/', (req, res) => {
    res.render('index.ejs')
  })

  app.get('/login', (req, res) => {
    res.render('login.ejs', { message: req.flash('loginMessage') })
  })

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
  })

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.get('/connect/local', (req, res) => {
    res.render('connect-local.ejs', { message: req.flash('loginMessage') })
  })

  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/connect/local',
    failureFlash: true
  }))

  app.get('/unlink/local', function (req, res) {
    req.user.local.email = undefined
    req.user.local.password = undefined
    req.user.save((err) => {
      if (err) throw err
      res.redirect('/profile')
    })
  })

  // app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))

  app.get('/auth/facebook', (req, res, next) => {
    console.log('SESSÃO CRIADA ----------> ', req.session)
    passport.authenticate('facebook', { scope: 'email' })(req, res, next)
  })

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

  app.get('/connect/facebook', passport.authorize('facebook', { scope: ['email', 'public_profile'] }))

  app.get('/connect/facebook/callback', passport.authorize('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

  app.get('/unlink/facebook', (req, res) => {
    req.userreq.user.facebook.token = undefined
    req.user.save((err) => {
      if (err) throw err
      res.redirect('/profile')
    })
  })

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

  app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }))

  app.get('/connect/google/callback', passport.authorize('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }))

  app.get('/unlink/google', (req, res) => {
    req.user.google.token = undefined
    req.user.save((err) => {
      if (err) throw err
      res.redirect('/profile')
    })
  })

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user
    })
  })

  app.get('/logout', (req, res) => {
    console.log('SESSÃO DESTRUIDA ----------> ', req.session)
    req.logout()
    req.session.destroy()
    res.redirect('/')
  })
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}
