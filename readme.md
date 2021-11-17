A simple communication wrapper for usage with the tuya cloud api


# Install 

```
npm i tuya-cloud-api-coupling
```

or

```
yarn add tuya-cloud-api-coupling
```

# Setup 
  - Create an account for tuya (from other tutorials I heard US account is best for instant acceptance)
  - Go to Cloud -> Development
  - Press the Upgrade IoT Core Plan
  - Sign up for Trail Package (is free)
  - Create a cloud project with 
    -  Industry: Smart Home
    -  Development Method: Smart home
    -  Data center: Look in your Smart Life app under me -> settings (right top button) -> account and security -> region
    - Look up the corresponding data center on https://github.com/tuya/tuya-home-assistant/blob/main/docs/regions_dataCenters.md (Also remember the endpoint for in code later)
  - Then you get a popup where you can authorize api products, here you add Device status notifications and keep the rest also enabled.
  - Your project gets created
  - Go to devices -> Link Tuya App Account
  - Click on add App App Account
  - Go in the Smart Life app on your phone to "me" and then open QR scanner(right top corner square with stripe) 
  - Scan the QR code
  - If you have the correct datacenter you should be able to add it
  - Then your devices should show up in Devices -> All devices 
  - Copy a Device id to the example
  - Copy the Access ID and Access Secrets from the overview
  - Copy the examples/config.example.js -> examples/config.js
  - Fill in the data in the example below

# Example 
There are examples in the example directory

Basic usage:
```
    const TuyaCloudApiCoupling = require("tuya-cloud-api-coupling");
    // import * as TuyaCloudApiCoupling from 'tuya-cloud-api-coupling'

    let connection = new TuyaCloudApiCoupling.Connection({
    // Check readme above for your correct endpoint
        host: 'https://openapi.tuyaeu.com',
        accessId: 'some id from tuya cloud -> developers -> project',
        accessSecret: 'some secret from tuya cloud -> developers -> project'
    })

    const deviceId = 'id of a device'
    const data = await connection.get(`/v1.0/devices/${deviceId}`, {});
    console.log(data);

```
# API documentation.

GET /v1.0/devices/${deviceId} -> Current device state
https://developer.tuya.com/en/docs/cloud/device-management?id=K9g6rfntdz78a

POST /v1.0/devices/{device_id}/commands -> to send a command
https://developer.tuya.com/en/docs/cloud/device-control?id=K95zu01ksols7#title-36-API%20description

