
const Tuya = require("../lib");
const config = require("./config");

let getDeviceInfo = async () => {
    let connection = new Tuya.Connection({
        host: config.host,
        accessId: config.accessId,
        accessSecret: config.accessSecret
    })

    const data = await connection.get(`/v1.0/devices/${config.testDevice}`, {});
    console.log('success: ', data);
}

getDeviceInfo();