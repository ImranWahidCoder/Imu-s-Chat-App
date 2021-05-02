const socket=io();
const messageInput=document.querySelector('.messageInp');
const btn=document.querySelector('.btn');
const messageContainer=document.querySelector('.container');
const button_two=document.querySelector('.btn_lc');
const feedback=document.querySelector('.feedback');

const name=prompt("Enter your name to join");
const audio=new Audio('./mp3/fb.mp3');
const joining=new Audio('./mp3/join.mp3');


messageInput.addEventListener('keypress',(e)=>
{
    socket.emit('typing',name);
});

const append=(message)=>
{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('extra');
    messageContainer.append(messageElement);
    joining.play();
}
const append_message=(message,user,position)=>
{
    const main_div=document.createElement('div');
    main_div.classList.add('message');
    if(position=='right')
    {
        main_div.classList.add('r');
    }
    else
    {
        main_div.classList.add('l');
    }
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('text');
    messageElement.classList.add(position);
    const handle=document.createElement('div');
    handle.innerHTML=`<img src="./Images/user.png" height="20px" width="20px" class="gol"> ${user}`;
    handle.classList.add('username');
    main_div.append(handle);
    main_div.append(messageElement);
    messageContainer.append(main_div);
    if(position=='left')
    {
        audio.play();
    }
}
const append_location=(message,user,position)=>
{
    const main_div=document.createElement('div');
    main_div.classList.add('message');
    if(position=='right')
    {
        main_div.classList.add('r');
    }
    else
    {
        main_div.classList.add('l');
    }
    const messageElement=document.createElement('div');
    messageElement.innerHTML=`<div class="link_loc"><a href=https://google.com/maps/?q=${message.latitude},${message.longitude}>This is my current location</a></div>`;
    messageElement.classList.add('text');
    messageElement.classList.add(position);
    const handle=document.createElement('div');
    handle.innerText=user;
    handle.classList.add('username');
    main_div.append(handle);
    main_div.append(messageElement);
    messageContainer.append(main_div);
    if(position=='left')
    {
        audio.play();
    }
}
socket.emit('new-user-joined',name);
socket.on('user-joined',name=>
{
    append(`${name} joined the chat`);
    messageContainer.scrollTop=messageContainer.scrollHeight;
});
socket.on('receive',data=>
{
    feedback.innerHTML=null;
    append_message(`${data.message}`,`${data.name}`,'left');
    messageContainer.scrollTop=messageContainer.scrollHeight;
});
socket.on('left',name=>
{
    append(`${name} left the chat`);
    messageContainer.scrollTop=messageContainer.scrollHeight;
});
socket.on('get',data=>
{
    feedback.innerHTML=null;
    append_location({latitude:data.message.latitude,longitude:data.message.longitude},`${data.name}`,'left');
    messageContainer.scrollTop=messageContainer.scrollHeight;
});
socket.on('res',data=>
{
    append_message(data,'You','right');
    messageContainer.scrollTop=messageContainer.scrollHeight;
});
socket.on('still_typing',data=>
{
    feedback.innerText=data;
})
btn.addEventListener('click',(e)=>
{
    e.preventDefault();
    const text=messageInput.value;
    if(text)
    {
        append_message(text,'You','right');
        socket.emit('send',text);
        messageInput.value=null;
        messageContainer.scrollTop=messageContainer.scrollHeight;
    }
});
button_two.addEventListener('click',(e)=>
{
    e.preventDefault();
    if(!navigator.geolocation)
    {
        return alert(`Your browser doesn't support geo-location privileges`);
    }
    navigator.geolocation.getCurrentPosition((position)=>
    {
        append_location({latitude:position.coords.latitude,longitude:position.coords.longitude},`You`,'right');
        socket.emit('kothai',{latitude:position.coords.latitude,longitude:position.coords.longitude});
        messageContainer.scrollTop=messageContainer.scrollHeight;
    });
});
