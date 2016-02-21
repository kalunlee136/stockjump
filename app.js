var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios');
//var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');


// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));


app.use('/', routes);
app.use('/users', users);

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});


/* socket.io config */
io.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });

  socket.on('news', function (symbol) {
    var req = 'https://www.quandl.com/api/v3/datasets/WIKI/'+symbol+'/data.json?start_date=2015-01-01&api_key=U4z9mnDz1Bg5ZDbo7MDF';
    
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    axios.get(req).then(function(res){
      var stock_list = res.data.dataset_data.data;
      var stock = stock_list.reverse().map(function(date){
        var list = date[0].split('-');
        var unix_date = Date.UTC(list[0], list[1] - 1, list[2] - 1);
        return [unix_date, date[4]];
      });
      
      io.emit('news',{'name': symbol, 'data': stock, 'color': getRandomColor()});
    });
    
  });
  
  socket.on('remove',function (id) {
    io.emit('remove',id);
    
  })
});


