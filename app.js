const express = require("express");
const bodyParser = require("body-parser");
var flash = require('express-flash');
var session = require('express-session');
//const cors = require("cors");
const dbConfig = require('./app/config/db.config')
const app = express();
var path = require("path");
// var corsOptions = {
//   origin: "http://localhost:8081"
// };

// app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('./app/models');

const Role = db.role;
db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    autoIndex: true, //to make email unique

}).then(()=>{
    console.log("connected");
    initial();
}).catch(err=>{
    console.log(err);
    process.exit();
})
app.set('views', [
  path.join(__dirname+"/app", 'views'),
  
]);
app.use(session({
  key: "userauth",
  secret: "userauth12345",
  //store: store,
  // Forces the session to be saved 
    // back to the session store 
    resave: true, 
    // Forces a session that is "uninitialized" 
    // to be saved to the store 
    saveUninitialized: true,
  cookie: {
    maxAge: 7.776e+9,
  }
}));
app.use(flash());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname+"/app", 'public')));
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "moderator"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'moderator' to roles collection");
        });
  
        new Role({
          name: "admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  }
  module.exports = app