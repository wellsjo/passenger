Passenger
=========

Passenger is a lightweight chatroom utilizing WebRTC peer-to-peer browser connections, built over peerjs. The code can easily be altered to pass arbitrary information between browsers and the connection broker server. The server can also be modified to run remotely.

Here is a demo connecting and messaging between 9 browsers:
![alt tag](http://i.imgur.com/A7ULxhL.gif)

### Install
```bash
git clone git@github.com:wellsjo/passenger.git
cd passenger
npm install
# creates a run script
./devify.sh 
```
### Run Peer Server
```bash
# this will open your browser and start the local server
./run.sh
```
