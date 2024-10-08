const express =require('express');
const app=express();
const http=require('http');
const socketio=require('socket.io');
const path=require('path');
const server=http.createServer(app);
const io=socketio(server);

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
io.on('connection',function(socket){
    socket.on('sendLocation',function(data){
        io.emit('receiveLocation',{socketId:socket.id,latitude:data.latitude,longitude:data.longitude});
    }   )
   
    socket.on('disconnect',function(){
        io.emit('user-disconnected',{socketId:socket.id});
    })
})

app.get('/',function(req,res){
    res.render('index');
})
const PORT=process.env.PORT || 3000;
server.listen(PORT,function(){
    console.log(`Server started on port ${PORT}`);
})