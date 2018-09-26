const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

class Users {
    update(data) {
        if (data !== '') {
            let userDataArray = data.substr(1).split('<');
            let userArray = userDataArray.map(userData => {
                let user = new User(userData);
                return [user.username, user];
            });
            this.userMap = new Map(userArray);
        }
    }

    getUser(username) {
        return this.userMap.get(username);
    }
}

class User {
    constructor(data) {
        this.Sex = Sex;
        this.Status = Status;
        this.Client = Client;

        let userArray = data.split('>').map(elem => entities.decode(elem));
        let sex, status, client, _;

        [
            this.icon,
            sex,
            this.username,
            this.color,
            this.room,
            status,
            this.sign,
            _,
            this.uid,
            client,
            this.privateChatImage
        ] = userArray;

        this.sex = parseInt(sex);
        this.status = parseInt(status) || Status.NO_STATUS;
        this.client = parseInt(client) || Client.DESKTOP;
    }
}

const Sex = {
    NONE: 0,
    MALE: 1,
    FEMALE: 2,
    COUPLE: 3
}

const Status = {
    CHATTING: 0,
    BUSY: 1,
    GONE_OUT: 2,
    EATING: 3,
    CALLING: 4,
    TRAVELLING: 5,
    WASHROOM: 6,
    SHOWERING: 7,
    SLEEPING: 8,
    AFK: 9,
    NO_STATUS: 10
}

const Client = {
    DESKTOP: 0,
    MOBILE: 1,
    ANDROID_LITE: 2,
    ANDROID: 5,
    IOS: 6,
    WINDOWS: 7
}

module.exports = new Users();