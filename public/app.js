class Message {
    constructor(name, message) {
        this.name = name;
        this.message = message;
    }
   
    init() {
       
        this.createMessage();
    }

    createMessage() {
        const message = document.createElement('div');
        if(infoUserInput.value === this.name){
            message.classList.add("message-item", "message-item--current-user");
        }else {
            message.classList.add("message-item", "message-item--other-user");
        }

        const userName = document.createElement('span');
        userName.classList.add('name');
        userName.textContent = this.name;

        const userStatus = document.createElement('span');
        userStatus.classList.add('status');

        const messageDate = document.createElement('span');
        messageDate.classList.add('date');
        messageDate.textContent = this.createDate();

        const messageText = document.createElement("span");
        messageText.classList.add("message");
        messageText.textContent = this.message;

        message.append(userName,messageText,messageDate);

        return message;
        
    }

    createDate() {
        const date    = new Date();
        const day     = date.getDate();
        const month   = date.getMonth();
        const year    = date.getFullYear();
        const hour    = this.checkZero(date.getHours());
        const minutes = this.checkZero(date.getMinutes());
        const seconds = this.checkZero(date.getSeconds());

        return `${day}.${month}.${year}, ${hour}:${minutes}:${seconds}`;
    }

    checkZero(time) {
        return time < 10 ? `0${time}` : time;
    }
}

const infoUserForm   = document.querySelector(".info-user");
const infoUserInput  = document.querySelector(".info-user__name");
const userNameButton = document.querySelector(".info-user__button");
const messageArea    = document.querySelector(".messages");
const formAction     = document.querySelector(".action");
const actionMessage  = document.querySelector(".action__message");
const feedback       = document.querySelector('.feedback');

let timer    = null;
const socket = io();

actionMessage.addEventListener("keypress", (e) => {
    socket.emit("typing");
})

infoUserForm.addEventListener("submit", e => {
    e.preventDefault();
    if(infoUserInput.disabled) {
        infoUserInput.removeAttribute("disabled");
        infoUserInput.classList.remove("info-user__name--disable");
        userNameButton.textContent = "Подтвердить имя";
        
    }else {
        infoUserInput.setAttribute("disabled","disabled");
        infoUserInput.classList.add("info-user__name--disable");
        userNameButton.textContent = "Выбрать новое имя";
        socket.emit("change__username", {username:infoUserInput.value});
    }
});

formAction.addEventListener('submit', e => {
    e.preventDefault();
    if(actionMessage.value) {
        const userMessage = {
            message: actionMessage.value,
        }
        socket.emit('new_message', userMessage);
        feedback.innerHTML = "";
        actionMessage.value = "";
    }
})

socket.on("typing",  data => {
    feedback.innerHTML = `${data.username} печатает...`;
    feedback.classList.remove("feedback--hidden");
    clearTimeout(timer);
    timer = setTimeout(() => {
        feedback.classList.add("feedback--hidden");
    }, 500);
})

socket.on('add_mess', res => {
    const data = (res);
    messageArea.append(new Message(data.username, data.message).createMessage());
    messageArea.scrollTop = messageArea.scrollHeight;
})