
const TuyaCloudApiCoupling = require("../lib");
const config = require("./config");

let toggleSwitchLight = async () => {
    let connection = new TuyaCloudApiCoupling.Connection({
        host: config.host,
        accessId: config.accessId,
        accessSecret: config.accessSecret
    })

    const data = await connection.get(`/v1.0/devices/${config.testDevice}`, {});

    let command = {commands:[
        {
            "code": "switch_1",
            "value": !data['result']['status'][0]['value']
        }
    ]}

    const commandResult = await connection.post(`/v1.0/devices/${config.testDevice}/commands`, {},  command);
    console.log('success: ', commandResult);
}

toggleSwitchLight();