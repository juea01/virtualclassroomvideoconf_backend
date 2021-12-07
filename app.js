var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var http = require('http');
var auth = require('./routes/auth');
var room = require('./routes/room');



var app = express();
app.use(cors());

var server = http.createServer(app);
const io = require("socket.io")(server,{
  cors: {
    origin: "*",
    methods: "*"
  }
});
const { ExpressPeerServer} = require("peer");
const peerServer = ExpressPeerServer (server, {
  debug: true,
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/login',auth);
app.use('/room',room);
app.use('/peerjs', peerServer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, peerId, userName, signInMode) => {
    console.log("Join-room");
    console.log("RoomId"+roomId);
    console.log("peer id"+peerId);
    console.log("user name"+ userName);
    console.log("signInMode"+signInMode);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", peerId, userName, signInMode);
  })
})

//for chatting


io.on("connection",(socket) =>{
  socket.on("messages",(roomId, userId,messageId,msg,handsUp,hasMessage) => {
    console.log("messages");
    console.log("RoomId"+roomId);
    console.log("messager id"+userId);
    console.log("message"+msg);
    console.log("handsUp"+handsUp);
    socket.join(roomId);

    if(hasMessage) {
      var responseMessage = `{"id": ${messageId}, "messagerName": "${userId}","message": "${msg}", "handsUp": ${handsUp},"hasMessage":${hasMessage}}`;
    } else {
      var responseMessage = `{"id": 1,"messagerName": "${userId}","message": "no message",  "handsUp": ${handsUp},"hasMessage":${hasMessage}}`;
    }
    

    const message = JSON.parse(responseMessage);
    console.log(message);
    socket.to(roomId).emit("messages",message);

  })
} )

getHttpServer = function() {
  return server;
}

module.exports ={
  app,
  getHttpServer
} 
