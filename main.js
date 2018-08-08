const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const ws = require('./websocket');
const config = require('./config');

ws.onopen = () => {
    console.log('WebSocket 已连接');
    ws.send('*' + JSON.stringify(config));
    setInterval(() => ws.send('u'), 36e4);
};

ws.onmessage = message => {
    if (/\d/.test(message[0])) {
        chatMessage(message);
    }
};

// 处理消息
function chatMessage(message) {
    let messageArray = message.split('"');
    if (messageArray[0]) {
        publicMessage(messageArray[0]);
    }
    if (messageArray[1]) {
        // privateMessage(messageArray[1]);
    }
}

// 聊天室消息
function publicMessage(message) {
    message.split('<').forEach(element => {
        let messageArray = element.split('>');
        let user = entities.decode(messageArray[2]);
        let text = messageArray[3];

        if (text[0] === "'") {
            systemMessage(user, text);
        } else {
            console.log(`${user}说： ${entities.decode(text)}`);
        }
    });
}

// 系统消息
function systemMessage(user, code) {
    let showTextArray = [
        '进入了房间',
        '更换了房间',
        '离开了'
    ];

    let showText = showTextArray[parseInt(code[1]) - 1];
    console.log(`${user} ${showText}`);
}

// 私信
// function privateMessage(message) {

// }
