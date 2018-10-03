USB Relay
=============

Control simple USB HID Relays using Node JS like this one:

![picture alt](https://github.com/josephdadams/USBRelay/raw/master/usbrelay.jpg "USB Relay")

To use:

```javascript
const USBRelay = require("./USBRelay.js");
const relay = new USBRelay(); //gets the first connected relay
```

To use a specific relay, specify a HID path:

```javascript
const relay = new USBRelay(path);
```

Get connected relays:

```javascript
relay.Relays(); //returns an array with HID data including paths
```

Set relay state:

```javascript
relay.setState(1, true); // turns Relay 1 of the device on
relay.setState(1, false); // turns Relay 1 of the device off
```
Relay numbers are NOT zero-based, so if you want to refer to Relay #1, use 1.

To turn all relays off:

```javascript
relay.setState(0, false); // relay number 0 references all relays of the device
```

To turn a relay on, wait 1 second, and then turn off:

```javascript
relay.setState(1, true);

setTimeout(function () {
    relay.setState(1, false);
}, 1000);
```
