const WebSocket = require('ws');
const pako = require('pako');

const ws = new WebSocket('wss://m.iirose.com:8777', {
    rejectUnauthorized: false
});

ws.binaryType = 'arraybuffer';

ws.onopen = () => {
    module.exports.onopen();
};

ws.onmessage = event => {
    let array = new Uint8Array(event.data);

    let message;
    if (array[0] == 1) {
        message = pako.inflate(array.slice(1), {
            to: 'string'
        });
    } else {
        message = Buffer.from(array).toString('utf8');
    }

    module.exports.onmessage(message);
};

module.exports = {
    send: data => {
        let buffer = Buffer.from(data);
        let array = Uint8Array.from(buffer);

        if (array.size > 256) {
            let deflatedData = pako.gzip(data);
            let deflatedArray = new Uint8Array(deflatedData.length + 1);
            deflatedArray[0] = 1;
            deflatedArray.set(deflatedData, 1);
            ws.send(deflatedArray);
        } else {
            ws.send(array);
        }
    }
};
