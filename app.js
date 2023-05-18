const express = require('express');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const errorHandler =require('./middleware/errorHandler');
const db = require('./config/db');
const socketapi = require('./socket/socketapi');
const app = express();

app.use(session({
  secret: 'learnwise3490283',
  resave: false,
  saveUninitialized: true,
}));


const usersRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const teacherRouter = require('./routes/teacherRouter');


//cors
app.use(
  cors({
    origin: ['http://localhost:4000'],
    methods: ["GET", "POST", "DELETE", "PUT","PATCH"],
    credentials: true
  })
);


app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




//db connection
db(() => {
  try {
    console.log("DataBase Successfully Connected");
  } catch (error) {
    console.log("Database Not Connected : ", error);
  }
});

//routes
app.use('/', usersRouter);
app.use('/admin', adminRouter);
app.use('/teacher', teacherRouter);

// ERROR HANDLER MIDDLEWARE 
app.use(errorHandler);


//multer error
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    if (err.code === 'LIMIT_FILE_TYPE') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: err.message });
    }
  } else {
    // An unknown error occurred
    res.status(500).json({ message: 'Unknown error occurred' });
  }
});


// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({message:'Sorry, we cannot find that!'});
});



//create server
const server=app.listen(process.env.PORT, () => {
  console.log('Server listening on port 3000');
})

//connection socket io
socketapi.io.attach(server, {
  cors: {
    origin: '*'
  }
});



module.exports = {app};
