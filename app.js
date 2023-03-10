const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const db = require('./config/db');
const app = express();

require('dotenv').config();

const usersRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');

app.use(
  cors({
    origin: ['http://localhost:4000'],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
  })
);

app.use(session({
  secret: 'learnwise3490283',
  resave: false,
  saveUninitialized: true,
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', usersRouter);
app.use('/admin',adminRouter);


//db connection
db(() => {
  try {
    console.log("DataBase Successfully Connected");
  } catch (error) {
    console.log("Database Not Connected : ", error);
  }
});



module.exports = app;
