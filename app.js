const express = require('express');
require('dotenv').config();


const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const db = require('./config/db');
// const passportSetUp = require('./helpers/passport');

const app = express();

app.use(session({
  secret: 'learnwise3490283',
  resave: false,
  saveUninitialized: true,
}));


const usersRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const teacherRouter = require('./routes/teacherRouter');

app.use(
  cors({
    origin: ['http://localhost:4000'],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
  })
);



app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/', usersRouter);
app.use('/admin',adminRouter);
app.use('/teacher',teacherRouter);


//db connection
db(() => {
  try {
    console.log("DataBase Successfully Connected");
  } catch (error) {
    console.log("Database Not Connected : ", error);
  }
});



module.exports = app;
