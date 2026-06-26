require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const { sequelize } = require('./models');
require('./config/passport')(passport);

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsing & static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Make user & flash available in all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/web/index'));
app.use('/auth', require('./routes/web/auth'));
app.use('/projects', require('./routes/web/projects'));
app.use('/tasks', require('./routes/web/tasks'));
app.use('/api/v1/auth', require('./routes/api/auth'));
app.use('/api/v1/projects', require('./routes/api/projects'));
app.use('/api/v1/tasks', require('./routes/api/tasks'));

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found' });
});

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to database:', err);
    process.exit(1);
  });
