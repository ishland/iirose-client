const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const ws = require('./websocket');
const config = require('./config');

const users = require('./users');
const rooms = require('./rooms');

ws.onopen = () => {
    console.log('WebSocket 已连接');
    ws.send('*' + JSON.stringify(config));
};

ws.onmessage = message => {
    if (/^-\*/.test(message)) {
        changeRoom(message.substr(2));
    } else if (/\d/.test(message[0])) {
        chatMessage(message);
    } else if (/^%\*/.test(message)) {
        freshInfo(message.substr(2));
    }
};

// 更换房间
function changeRoom(roomID) {
    let roomName = rooms.getRoom(roomID).name;
    console.log(`切换至房间 ${roomName}`);
    config.r = roomID;
    ws.reopen();
}

function freshInfo(data) {
    let infoArray = data.split("'");

    let roomInfoData = infoArray[1];
    freshRoomInfo(roomInfoData);

    let userInfoData = infoArray[0];
    freshUserInfo(userInfoData);
}

function freshUserInfo(data) {
    users.update(data);
    let roomID = users.getUser(config.n).room;
    if (roomID !== config.r) {
        changeRoom(roomID);
    }
}

function freshRoomInfo(data) {
    rooms.update(data);
}

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
            console.log(`${user} 说： ${entities.decode(text)}`);
        }
    });
}

// 系统消息
function systemMessage(user, code) {
    let message;

    switch (code[1]) {
    case '1':
        message = '进入了房间';
        break;
    case '2':
        let roomID = code.substr(2);
        let roomName = rooms.getRoom(roomID).name;
        message = `移动到了：${roomName}`;
        break;
    case '3':
        message = '离开了';
        break;
    }

    console.log(`${user} ${message}`);
}

// 私信
// function privateMessage(message) {

// }
