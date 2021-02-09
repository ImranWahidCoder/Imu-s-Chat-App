const express=require('express');
const path=require('path');
const socket=require('socket.io');
const moment = require("moment");

const app=express();
const port=process.env.PORT || 8000; 
const server= app.listen(port,()=>
{
    console.log(`Listening to the port ${port}`);
});

app.use(express.static('public'));
const io=socket(server);
const users={};
io.on('connection',socket=>
{
    socket.on('new-user-joined',name=>
    {
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });
    socket.on('send',message=>
    {
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]});
    });
    socket.on('disconnect',message=>
    {
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
    socket.on('kothai',data=>
    {
        socket.broadcast.emit('get',{message:data,name:users[socket.id]});
    });
    socket.on('typing',data=>
    {
        socket.broadcast.emit('still_typing',`${data} is typing a message...`);
    })
});