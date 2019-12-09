//init project
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const cors = require('cors')


//xuejie
// var passport = require('passport');
// var GoogleStrategy = require('passport-google-oauth20').Strategy;
// passport.use(new GoogleStrategy({
//   clientID: '649734311161-rujo80dortljn9soqpbfs9svd7ha90r0.apps.googleusercontent.com',
//   clientSecret: '8nAaR2S3xv9vcqI6C23esQXf',
//   callbackURL: 'http://localhost:3000/login/google/return',
// },
// function(token, tokenSecret, profile, cb) {
//   console.log(profile.emails[0].value);
//   return cb(null, profile);
// }));
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });
// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });


//Establish a connection with the Mongo Database
const mongoDB = 'mongodb://127.0.0.1/yelp';
mongoose.connect(mongoDB);
// 让 mongoose 使用全局 Promise 库
mongoose.Promise = global.Promise;
// 取得默认连接
const db = mongoose.connection;
// 将连接与错误事件绑定（以获得连接错误的提示）
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));
mongoose.connect(mongoDB, {useNewUrlParser: true, retryWrites: true});

//debugging 
mongoose.connection.on('connected', function (){
  console.log('Mongoose connected to ');
});
mongoose.connection.on('error', function (err){
  console.log('Mongoose connection error: '+err);
});
mongoose.connection.on('disconnected', function (){
  console.log('Mongoose disconnected.');
});

//start express
const app = express();

// app.all('*', function(req, res, next) {
//   //res.header("Access-Control-Allow-Origin", "");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("Access-Control-Allow-Credentials", 'true');
//   res.header("Access-Control-Expose-Headers", "*");
//   next();
// });
app.use(cookieParser());
// app.use(session({secret:'keyboard cat', cookie:{maxAge: 60000}, store : store}))
app.use(cors({credentials : true, origin : 'http://100.64.11.123:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

//Initialize Passport and restore authentication state, if any, from the session.
// app.use(passport.initialize());
// app.use(passport.session());


const apiRouter = require("./routes/api");
// const indexRouter = require("./routes/index");


// app.use("/pages", indexRouter);
app.use("/api", apiRouter);


app.listen(4000, () => console.log('yelp server running on port 4000!'))