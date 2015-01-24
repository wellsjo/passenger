passenger
=========

A lightweight chatroom utilizing WebRTC peer-to-peer browser connections.

Here is a demo connecting and messaging between 9 browsers:
![alt tag](http://i.imgur.com/A7ULxhL.gif)

Bare in mind, the code can easily be altered to pass arbitrary information between browsers and the connection broker server.  The server can also be run locally or remotely (different files though).

To run:
```bash
git clone https://github.com/wellsjo/Passenger.git && cd Passenger
npm install
node app/server/client-server-local
# open a new terminal window
open app/client/html/client.html
```
