
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

  app.get('/auth/facebook', function (req, res, next) {
    res.cookie('success_url', req.query.success_url)
    passport.authenticate('facebook', {scope: 'email', callbackURL: '/auth/facebook/callback'})(req, res, next)
  })

  app.get('/auth/facebook/callback', (req, res, next) => {
    console.log('COOKIES AQUI ---------> ', req.cookies)
    passport.authenticate('facebook', (err, user, info) => {
      if (err) {
        console.log('----------------  TEMOS UM ERRO  ----------------')
        console.error(err)
        return next(err)
      }
      if (!user) { return res.redirect('/') }
      req.logIn(user, (err) => {
        if (err) { return next(err) }
        return res.redirect(req.cookies.success_url)
      })
    })(req, res, next)
  })

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
    req.logout()
    res.redirect('/')
  })
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/')
}
