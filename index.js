/*
 * USBRelay
 * Copyright(c) 2018 Joseph Adams, github.com/josephdadams/usbrelay
 * MIT Licensed
 */

'use strict';

var HID = require('node-hid');

class USBRelay
{
    //gets relay devices currently connected
    static get Relays()
    {
        const devices = HID.devices();
        const connectedRelays = devices.filter(device => {
            return device.product && device.product.indexOf("USBRelay") !== -1;
        });
        connectedRelays.forEach(device=>{
            try{
                device.serial = new USBRelay(device.path).getSerialNumber();
            }
            catch(e){
                device.serial = "";
            }
        });
        return connectedRelays;
    }
        
    constructor(devicePath)
    {
        if (typeof devicePath === 'undefined')
        {
                // Device path was not provided, so let's select the first connected device.
                const devices = HID.devices();
                console.log(devices);
                const connectedRelays = devices.filter(device => {
                    return device.product && device.product.indexOf("USBRelay") !== -1;
                });
                if (!connectedRelays.length) {
                    throw new Error('No USB Relays are connected.');
                }
                this.device = new HID.HID(connectedRelays[0].path);
        }
        else
        {
            this.device = new HID.HID(devicePath);
        }
    }
    
    //set the current state (on = true, off = false) of relayNumber
    setState(relayNumber, state)
    {
        // Byte 0 = Report ID
        // Byte 1 = State
        // Byte 2 = Relay
        // Bytes 3-8 = Padding

        // index 0 turns all the relays on or off
        var relayOn = [
            [0x00, 0xFE, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFF, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFF, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFF, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFF, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFF, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFF, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFF, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFF, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        ];

        var relayOff = [
            [0x00, 0xFC, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFD, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFD, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFD, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFD, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFD, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFD, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFD, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
            [0x00, 0xFD, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
        ];

        var command = null;

        if (state)
        {
            command = relayOn[relayNumber];
        }
        else
        {
            command = relayOff[relayNumber];
        }

        this.device.sendFeatureReport(command);
    }   

    getState(relayNumber)
    {
        let relayIndex = relayNumber-1;
        if(relayIndex<0 || relayIndex>7){
            throw new Error('Invalid relayNumber must be between 1 and 8');
        }
        let report = this.device.getFeatureReport(0,9);
        
        return ((report[8]>>relayIndex)&1)==1;
    }

    getSerialNumber()
    {
        let report = this.device.getFeatureReport(0,9);
        let serial = new Array(5);
        for(let i=0;i<5;i++){
            serial[i]=String.fromCharCode( report[i+1] );
        }
        
        return serial.join("");
    }
}

module.exports = USBRelay;
