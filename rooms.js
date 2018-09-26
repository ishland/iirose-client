const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

class Rooms {
    update(data) {
        if (data !== '') {
            let roomDataArray = data.substr(1).split('<');
            let roomArray =  roomDataArray.map(roomData => {
                let room = new Room(roomData);
                return [room.id, room];
            });

            this.roomMap = new Map(roomArray);
        }
    }

    getRoom(roomID) {
        return this.roomMap.get(roomID);
    }
}

class Room {
    constructor(data) {
        this.parseData(data);
    }

    setDefaults() {
        this.protection = Protection.OPEN;
        this.description = '';
        this.members = '';
    }

    parseData(data) {
        let roomArray = data.split('>');
        let roomInfo = roomArray.pop();
        roomArray = roomArray.map(elem => entities.decode(elem));

        let id;
        let protection;

        [
            id,
            this.name,
            this.bgColor,
            this.attributes,
            protection,
        ] = roomArray;

        let idArray = id.split('_');
        this.id = idArray[idArray.length - 1];

        this.protection = parseInt(protection) || Protection.OPEN;

        this.parseRoomInfo(roomInfo);
    }

    parseRoomInfo(data) {
        let roomInfoArray = data.split('&&').map(elem => entities.decode(elem));
        let description, _;

        [
            description,
            this.owner,
            _,  // Owner gender
            _,  // Owner icon
            this.members
        ] = roomInfoArray;

        let delimiterIndex = description.indexOf(' ');
        this.image = description.substr(0, delimiterIndex);
        this.description = description.substr(delimiterIndex + 1);
    }

    getType() {
        return parseInt(this.attributes[0]);
    }

    isWeatherRoom() {
        return this.attributes[1] === '1';
    }

    isRolePlayRoom() {
        return this.attributes[2] === '1';
    }
}

const Protection = {
    OPEN: -1,
    LOCK: 0,
    LOCK_HIDE_PEOPLE: 1,
    LOCK_HIDE_PEOPLE_AMOUNT: 2
}

const Attribute = {
    ORDINARY: 0,
    MUSIC_SHARE: 1,
    VIDEO_SHARE: 2,
    MUSIC: 3,
    VIDEO: 4,
}

Object.assign(Rooms, {
    Protection: Protection,
    Attribute: Attribute
});

module.exports = new Rooms();