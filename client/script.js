console.log('hello world');

import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat-container');

let loadInterval ;


function loader (el){
     el.textContent =''
     loadInterval = setInterval(()=>{
        el.textContent+= '.';
        el.textContent=='....'? el.textContent='':el.textContent=el.textContent;

     },300)
}

function typeText(el, text){
    let index= 0;
    let interval =setInterval(()=>{
        if(index< text.length){
            el.innerHTML += text.charAt(index)
            index++;
        }
        else{
            clearInterval(interval)
        }
    },30)
}

function generateUniqueId(){
    const timeStamp= Date.now();
    const randomNumber = Math.random();
    const hexaDecimal = randomNumber.toString(16);
    console.log(hexaDecimal);
    return `id-${timeStamp}-${hexaDecimal}`

}

function chatStripe(isAi, value, uniqueId){
     return ( 
        `<div class="wrapper ${isAi && 'ai'}">
            <div class="chat" >
                <div class="profile" >
                    <img 
                        src="${isAi ? bot: user}"
                        alt = "${isAi ? 'bot': 'user'}"
                        />

                </div>
                <div class= "message" id="${uniqueId}">
                        ${value}
                </div>
            </div>
        </div> `
     )
}

const handleSubmit = async (e) =>{
    e.preventDefault();
    
    const data = new FormData(form);
    //users chat section
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))
    form.reset();

    //bots chat section
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML+= chatStripe(true, '', uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    // fetch data from server

    const response = await fetch('https://chatgpt-xn7y.onrender.com/',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        }, 
        body: JSON.stringify({
            prompt:data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    messageDiv.innerHTML='';
    if(response.ok){
        const data= await response.json();
        const parsedData = data.bot.trim();

        typeText(messageDiv, parsedData);
    }
    else{
        const error = await response.text();
         messageDiv.innerHTML= ' Something went wrong';
         alert(error.message)
    }
}


form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e)=>{
    if(e.keyCode===13){
        handleSubmit(e); 
    }
})