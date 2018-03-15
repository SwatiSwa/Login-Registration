var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var User = require('./model/User');

app.set('port', (process.env.PORT || 7000));

var mongoose = require('mongoose');

var userCtrl = require('./public/js/app');

mongoose.connect('mongodb://root:root@ds125914.mlab.com:25914/swa-db');

//Middlewares
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Services
app.post('/saveUser',function(request, response){
    var data = request.body.data;
    var user = new User({
        firstName : data.firstName,
        lastName  : data.lastName,
        email     : data.email,
        password  : data.password
    });

    user.save(function (err,data) {
        if (err) {
            if(err.code == 11000){
                response.send({
                    status : false,
                    data   : "User Id already exists! Kindly login!!"
                });
            }
            else{
                response.status(500).send(data);
            }
        } 
        else {
                response.send({
                    status : true,
                    data   : data
                });
        }
    });

});

app.get('/getUser', function(request, response){
    var username = request.query.username;
    var password = request.query.password;

    User.find({"email":username},function(err, res){
        if(err){
           response.status(500).send(err);
        }
        else{
            if(res.length){
                if(res[0].password == password){
                    response.send({
                        status : true,
                        data   : res[0]
                    });
                }
                else{
                    response.send({
                        status : false,
                        data   : "Invalid UserId/Password! Kindly verify!!"
                    });
                }
            }
            else{
                response.send({
                    status : false,
                    data   : "User doesn't exist! Kindly register!!"
                });
            }
        }
   });
});


app.listen(app.get('port'), function(){
    console.log("Server is listening on port 7000");
});

//app.use('/','server.js');
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  module.exports = app;